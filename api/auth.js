const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const jwt = require('jsonwebtoken');
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey :  'jaspher-secret-key'
};

router.post('/login', (req, res) => {
    const {username, password} = req.body;

    const findUser = () => {
        User.findOne({where: {username: username}})
        .then(oUser => {
            if (!oUser) {
                return res.status(400).json({message: "No user found"});
            }
            validatePassword(oUser);        
        })
        .catch(err => {
            res.status(400).json(err);
        })
    }

    const validatePassword = (oUser) => {
        bcrypt.compare(password, oUser.password, (err, result) => {
            if (result) {
                const payload = { id: oUser.id };
                const token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: '10m'});
                res.status(200).json({success: result, data: oUser, token: token, expiresIn: '600'});
            } else {
                res.status(400).json({message: "Password is incorrect"});
            }
        });
    }

    findUser()
})
module.exports = router