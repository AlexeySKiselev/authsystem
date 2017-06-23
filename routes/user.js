/**
 * User Page
 * Created by Alexey S. Kiselev on June 2017.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = require('../db/models/users');
var passport = require('passport');

// Check Login Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        if(req.user.userid == req.params.userid){
            return next();
        } else res.redirect('/user/'+req.user.userid);
    }
    res.redirect('/login');
}

// GET user page
router.get('/:userid', isLoggedIn, function(req, res) {
    res.render('userprofile', {
        title: 'Digitall Pill Test App Register Page',
        userid: req.params.userid,
        userprofile: req.user.userprofile
    });
});

// POST request for user page
router.post('/:userid', isLoggedIn, function(req, res, next) {
    Users.update({userid: req.body.userid},{ $set: {userprofile: req.body.userprofile}},{upsert:true}, function(err){
        if(err) {
            res.json('error');
            return next(err);
        }
        res.json({status: 'ok'})
    });
});

module.exports = router;
