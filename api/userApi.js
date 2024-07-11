const express = require('express');
const router = express.Router();
const isEmpty = require('../utility/isEmpty');
const joiValidator = require('../lib/joi/joi');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const passport = require('passport');

const jwt = require('jsonwebtoken');
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey :  process.env.JWT_SECRET_KEY
};

router.post('/create', (req, res) => {
    let oData = {
        username : req.body.username,
        password : req.body.password,
        firstname : req.body.firstname,
        lastname : req.body.lastname
    }

     const oValidateResult = joiValidator.oValidateUserData({
        ...oData, 
        ...{confirm_password : req.body.confirm_password}
    });
    
    
    if (oValidateResult.error) {
        const oError = {message: oValidateResult.error.details[0].message};
        return res.status(400).json(oError)
    }

    const hashPassword = () => {
        return new Promise ((resolve, reject) => {
            bcrypt.hash(req.body.password, 8, (err, hash) => {
                if (err) {
                    return res.status(400).json(err);
                }
                resolve(hash);
            })
        })       
    }

    hashPassword()
    .then(oResponse => {
        oData = {...oData, ...{password: oResponse}}
        checkUsername();
    })

    const checkUsername = () => {
        User.findOne({
            where: {username: req.body.username}
        })
        .then(oResponse => {
            if (oResponse) {                
                return res.status(400).json({message: 'Username already exist'})
            } 
            insertData();
        })
    }

    const insertData = () => {
        User.create(oData).then(oResponse => {
            const payload = { id: oResponse.id };
            const token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: '10m'});
            return res.status(200).json({success: true, data: oResponse, token: token, expiresIn: '600'});
        })
        .catch(err => {
            return res.status(400).json(err);
        }) 
    }
      
})


// router.get('/get', passport.authenticate('jwt', { session: false }), (req, res) => {
//     console.log('ditooo')
//     User.findAll()
//     .then(oResponse => {
//         return res.status(200).json(oResponse)
//     }).catch(err => {
//         return res.status(400).json(err)
//     })      
// })


router.get('/get/id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const id = req.query.id;   
    User.findOne({
        where: {id: id}
    }).then(oResponse => {
        const oUser = oResponse ? oResponse : [];
        return res.status(200).json(oUser)
    }).catch(err => {
        return res.status(400).json(err)
    })   
})

// router.get('/get/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
//     const username = req.params.username;
//     User.findOne({
//         where: {username: username}
//     }).then(oResponse => {
//         const oUser = oResponse ? oResponse : [];
//         return res.status(200).json(oUser)
//     }).catch(err => {
//         return res.status(400).json(err)
//     })    
// })




module.exports = router