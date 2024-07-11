const express = require('express');
const router = express.Router();
const joiValidator = require('../lib/joi/joi');
const {v4} = require('uuid');
const Book = require('../models/bookModel');
const User = require('../models/userModel');
const Moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const passport = require('passport');
const app = express();
// passport.authenticate('jwt', { session: false }),


const authUser = (req, res, next) => {
    const reqLength = req.body.length - 1;    
    (checkUser = (index) => {
        User.findOne({
            where: {id: req.body[index].userId}
        })
        .then(oResponse => {                
            if (!oResponse) {              
                const oRes = {message: 'No user found'}
                return res.status(400).json(oRes)
            }
            if (index === reqLength) {
                next();            
            } else {
                checkUser(index + 1)
            }            
        })
        .catch(err => {
            return res.status(400).json(err)
        })
    })(0)
   
}

const validateData = (req, res, next) => {
    const reqLength = req.body.length - 1;
    (validation = (index) => {
        const oData = {
            bookdate : Moment(req.body[index].bookdate, 'YYYY/MM/DD'),
            time_start : req.body[index].timeStart,
            time_end : req.body[index].timeEnd,                    
            rate_cost : req.body[index].rate,
            user_id : req.body[index].userId
        }

        const oValidateResult = joiValidator.oValidateBookSchema(oData);
        if (oValidateResult.error) {
            const oError = {message: oValidateResult.error.details[0].message};
            return res.status(200).json(oError)
        }
        if (index === reqLength) {
            next();            
        } else {
            validation(index + 1)
        }
    })(0)  
}

router.post('/book', [authUser, validateData], (req, res) => {
    const reqLength = req.body.length - 1;
    const oResult = [];
    (book = (index) => {   
        const oData = {
            bookdate : Moment(req.body[index].bookdate, 'YYYY/MM/DD'),
            time_start : req.body[index].timeStart,
            time_end : req.body[index].timeEnd,
            ref_code : v4(),        
            rate_cost : req.body[index].rate,
            user_id : req.body[index].userId
        }
        
        Book.create(oData)
        .then(oResponse => {
            if (oResponse) {oResult.push(oResponse)}
            if (index === reqLength) {
                return res.status(200).json(oResult);
            } else {
                book(index + 1)
            }
        }).catch(err => {
            return res.status(400).json(err)
        })       
    })(0)
})


router.get('/book/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.params.id
    Book.findAll({
        where: {user_id : user_id}
    })
    .then(oReponse => {
        return res.status(200).json(oReponse)
    })
    .catch(err => {
        return res.status(400).json(err)
    })
    
})

router.get('/book', (req, res) => {    
    Book.findAll()
    .then(oReponse => {
        return res.status(200).json(oReponse)
    })
    .catch(err => {
        return res.status(400).json(err)
    })
})

router.get('/range', (req, res) => {  
    const dateStart = Moment(req.query.date_start, 'MM-DD-YYYY');  
    const dateEnd = Moment(req.query.date_end, 'MM-DD-YYYY');
    Book.findAll({
        where: {
            bookdate: {[Op.between] : [dateStart, dateEnd]}
        }
    })
    .then(oResponse => {
        return res.status(200).json(oResponse)
    })
    .catch(err => {
        console.log(err)
        return res.status(400).json(err)
    })
    
})



module.exports = router