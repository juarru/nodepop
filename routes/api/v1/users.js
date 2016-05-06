/**
 * Created by juan_arillo on 30/4/16.
 *
 * Description: Users controller for API
 *
 * Version: v1
 */

'use strict';

// Loading auth library
let jwt = require('jsonwebtoken');
let config = require('../../../lib/local_config');

// Loading sha256 library
let sha = require('sha256');

// Loading express and router

let express = require('express');
let router = express.Router();

// Loading Mongoose and user´s model

let mongoose = require('mongoose');
let User = mongoose.model('User');

// Loading error handler library
let errors = require('../../../lib/errorHandler');

// Adding and saving user´s instance
router.post('/', function (req, res, next) {
    let user = new User(req.body);

    // sha256 encoding
    if (!user.key){
        errors('key field not fulfilled', res.status(500));
    }
    let shaPass = sha(user.key);
    user.key = shaPass;

    // Controlling fields validation
    try {
        let errors = user.validateSync();
    } catch (err){
        console.log('errors', error);
        next(err);
    }

    user.save(function (err, saved) {
        if(err){
            errors('Some require field is not sended. Please review', res.status(500));
            //next(err);
            return;
        }

        res.json({success: true, saved: saved});
    });
});

// JWT Authentication

// Authentication
router.post('/authenticate', function (req, res) {
    let email = req.body.email;
    let pass = sha(req.body.key);


    User.findOne({email: email}).exec(function(err, user){
        if(err){
            errors('Internal server error', res.status(500));
            return;
        }
        if(!email){
            errors('Authentication failed. User not found', res.status(401));
            return;
        }

        if(user.key !== pass){
            errors('Authentication failed. Invaid password', res.status(401));
            return;
        }

        let token = jwt.sign({id: user._id}, config.jwt.secret, {
            expiresIn: "2 days"
        });

        res.json({success: true, token: token});
    });
});


// Exporting the router
module.exports = router;
