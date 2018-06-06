// server.js
// load the things we need
var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose');       // add mongoose for MongoDB access
let session = require('express-session'); // add session management module
let connectMongo = require('connect-mongo'); // add session store implementation for MongoDB
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var md5 = require('md5');
var path = require('path');

const User = require('./model')("User");

var app = express();
let index = require('./routes/index');
let users = require('./routes/users');
let login = require('./routes/login');    // it will be our controller for logging in/out
//let flowers = require('./routes/flowers');

(async () => {
  let MongoStore = connectMongo(session);
  let sessConnStr = "mongodb://127.0.0.1/Dosh";
  let sessionConnect = mongoose.createConnection();
  try {
    await sessionConnect.openUri(sessConnStr);
  } catch (err) {
    console.log("Error connecting to session backend DB: " + err);
    process.exit(0);
  }
  process.on('SIGINT', async () => {
    await sessionConnect.close();
    process.exit(0);
  });

  // set the view engine to ejs
  app.use(logger('dev'));
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'views', 'dist', 'views')));
  app.use('/', express.static(path.join(__dirname, 'views', 'dist', 'views')));
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
  //app.use(cookieParser());

  let secret = 'Dosh secret'; // must be the same one for cookie parser and for session
  app.use(cookieParser(secret));

  app.use(session({
    name: 'users.sid',         // the name of session ID cookie
    secret: secret,            // the secret for signing the session ID cookie
    resave: false,             // do we need to resave unchanged session? (only if touch does not work)
    saveUninitialized: false,  // do we need to save an 'empty' session object?
    rolling: true,             // do we send the session ID cookie with each response?
    store: new MongoStore({ mongooseConnection: sessionConnect }), // session storage backend
    cookie: { maxAge: 900000, httpOnly: true, sameSite: true }  // cookie parameters
    // NB: maxAge is used for session object expiry setting in the storage backend as well
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
    function (req, username, password, done) {
      User.findOne({ userName: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!(user.password == password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));
  passport.serializeUser(function (user, done) {
    done(null, user.userName);
  });

  passport.deserializeUser(function (uname, done) {
    User.findOne({ userName: uname }, function (err, user) {
      done(err, user);
    });
  });
  app.use(favicon(path.join(__dirname, 'public', 'images', 'flower.ico')));
  app.use('/users', users);
  app.use('/login', login); // register login controller
  app.use('/', index);
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
  });
  // error handler
  // define as the last app.use callback
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  app.listen(80);
  console.log('80 is the magic port');
})()
  .catch(err => { console.log("Failure: " + err); process.exit(0); });

module.exports = app;