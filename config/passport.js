/**
 * Passport Authentification Configuration
 * Created by Alexey S. Kiselev on June 2017.
 */

var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Users = require('../db/models/users');

module.exports = function(passport){
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        Users.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
            usernameField: 'userid',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            Users.findOne({ userid: username }, function(err, user) {
                if (!user || !user.validPassword(password))
                    return done(null, false, {message: 'Username or Password is incorrect'});
                return done(null, user);
            });
        })
    );
};
