const express = require('express');
const router = express.Router();
const Rate = require('../models/rateModel');
const joiValidator = require('../lib/joi/joi');
const passport = require('passport');

router.put('/update/price', passport.authenticate('jwt', { session: false }), (req, res) => {    
    
    Rate.update({price: req.body.price}, {
        where: {id: req.body.id}
    })
    .then(oResponse => {
        if (oResponse) {
            const oRes = {message: 'Updated Successfully'}
            return res.status(200).json(oRes)
        }
    })
    .catch(err => {
        return res.status(400).json(err)
    })

    
})

router.post('/add/item', passport.authenticate('jwt', { session: false }), (req, res) => {
    const oData = {
        item : req.body.item,
        price : req.body.price
    }
    Rate.create(oData)
    .then(oResponse => {
        return res.status(200).json(oResponse)
    })
    .catch(err => {
        return res.status(400).json(err)
    })    
})


router.get('/items', (req, res) => {
    Rate.findAll()
    .then(oResponse => {
        return res.status(200).json(oResponse)
    })
    .catch(err => {
        return res.status(400).json(err)
    })
})
module.exports = router