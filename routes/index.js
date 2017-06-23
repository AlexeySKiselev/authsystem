/**
 * Index page
 * Created by Alexey S. Kiselev on June 2017.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = require('../db/models/users');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Digitall Pill Test App for Alexey S. Kiselev' });
});

// GET user login page
router.get('/login', function(req, res) {
    res.render('login', { title: 'Digitall Pill Test App Login Page' });
});

// GET user register page
router.get('/register', function(req, res) {
    res.render('register', { title: 'Digitall Pill Test App Register Page' });
});

// GET Logout
router.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});

// POST request for user register page
router.post('/register',function(req, res, next) {
    Users.findOne({userid: req.body.userid},function(err, user){
        if(user) {
            res.json({status:'already', userid: req.body.userid});
        } else {
            var User = new Users({
                userid: req.body.userid,
                password: Users.generateHash(req.body.password),
                userprofile: req.body.userprofile
            });
            User.save(function(err) {
                if(err) {
                    res.json('error');
                    throw err;
                }
                (passport.authenticate('local',function(err,user){
                    if(user){
                        req.login(user, function(err) {
                            if (err) return next(err);
                            res.json({status: 'ok', userid: user.userid});
                        });
                    }
                }))(req,res,next);
            });
        }
    });
});

// POST request for login
router.post('/login',function(req,res,next){
    (passport.authenticate('local',function(err,user,info){
        if(user){
            req.login(user, function(err) {
                if (err) return next(err);
                res.json({status: 'ok', userid: user.userid});
            });
        } else {
            res.json({status: 'nouser', message: info.message});
        }
    }))(req,res,next);
});

module.exports = router;
