/**
 * Simple REST App
 * Using Express - I can olso use Restify or Hapi
 * Created by Alexey S. Kiselev on June 2017.
 */

var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cookieParser = require('cookie-parser');

// Connecting to Database
var db = require('./config/db.js').url;
var mongoose = require('mongoose');
mongoose.connect(db,function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log('Successfully connected to', db);
    }
});
var MongoStore = require('connect-mongo')(session);

// Passport Auth
var passport = require('passport');
require('./config/passport')(passport);

// Routes
var index = require('./routes/index'),
    user = require('./routes/user');

// Create app
var app = express();

// View Engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

// App Settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'verysecterstring',
    saveUninitialized: true,
    resave: false,
    cookie : { maxAge: 43200000 },
    store: new MongoStore({
        url: db,
        collection : 'sessions',
        ttl: 43200
    }),
    maxAge: new Date(Date.now() + 43200000)
}));

// Auth with Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', index);
app.use('/user',user);

// Error and 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use(function(err, req, res, next) {
    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;