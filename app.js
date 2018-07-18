// server.js
// load the things we need
var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose'); // add mongoose for MongoDB access
let session = require('express-session'); // add session management module
let connectMongo = require('connect-mongo'); // add session store implementation for MongoDB
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var md5 = require('md5');
var path = require('path');
var crypto = require("crypto-js/aes");
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//var SMTPServer = require('smtp-server').SMTPServer;
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: '127.0.0.1',
  port: 8080,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'refael@127.0.0.1', // your domain email address
    pass: 'refael' // your password
  }
});

var mailOptions = {
  from: '"Bob" <refael@127.0.0.1>',
  to: 'refaelz1@walla.com',
  subject: "Hello",
  html: "Here goes the message body"
};

transporter.sendMail(mailOptions, function (err, info) {
  if (err) {
    console.log(err);
    return ('Error while sending email' + err)
  }
  else {
    console.log("Email sent");
    return ('Email sent')
  }
});





// const SMTP = new SMTPServer({
//   secure: false,
//   onAuth(auth, callback){
//     if(auth.username != 'refael' || auth.password != 'refael'){
//         console.log('Invalid username or password');
//     }
//     console.log(123); // where 123 is the user id or similar property
// }
// }).listen(8080,'127.0.0.1',function(err,user){console.log("drgdgdfgdgfgdffgddd");}); 

// nodemailer.createTestAccount((err, account) => {
//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//       host: '127.0.0.1',
//       port: 8080,
//       secure: false, // true for 465, false for other ports
//       auth: {
//           user: 'refael@localhost', // generated ethereal user
//           pass: 'refael' // generated ethereal password
//       }
//   });

//   // setup email data with unicode symbols
//   let mailOptions = {
//       from: '"Fred Foo 👻" <refael@localhost>', // sender address
//       to: 'refaelz1@walla.com', // list of receivers
//       subject: 'Hello ✔', // Subject line
//       text: 'Hello world?', // plain text body
//       html: '<b>Hello world?</b>' // html body
//   };

//   // send mail with defined transport object
//   transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//           return console.log(error);
//       }
//       console.log(2324234);
//       console.log('Message sent: %s', info.messageId);
//       // Preview only available when sending through an Ethereal account
//       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//       // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//       // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//   });
// });

const User = require('./model')("User");

var app = express();
let index = require('./routes/index');
let users = require('./routes/users');
let blogs = require('./routes/blogs');
let inbox = require('./routes/inbox');
let login = require('./routes/login'); // it will be our controller for logging in/out
//let flowers = require('./routes/flowers');
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Headers","Origin","X-Requested-With","Content-Type","Accept","Authorization");
  next();
});
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
  //app.use('/', express.static(path.join(__dirname, 'views', 'dist', 'views')));
  //app.use('/home', express.static(path.join(__dirname, 'views', 'dist', 'views')));
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({
    extended: false
  })); // support encoded bodies
  //app.use(cookieParser());

  let secret = 'Dosh secret'; // must be the same one for cookie parser and for session
  app.use(cookieParser(secret));

  app.use(session({
    name: 'users.sid', // the name of session ID cookie
    secret: secret, // the secret for signing the session ID cookie
    resave: false, // do we need to resave unchanged session? (only if touch does not work)
    saveUninitialized: false, // do we need to save an 'empty' session object?
    rolling: true, // do we send the session ID cookie with each response?
    store: new MongoStore({
      mongooseConnection: sessionConnect
    }), // session storage backend
    cookie: {
      maxAge: 900000,
      httpOnly: true,
      sameSite: true
    } // cookie parameters
    // NB: maxAge is used for session object expiry setting in the storage backend as well
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password',
    passReqToCallback: true
  },
    function (req, userName, password, done) {
      User.findOne({
        userName: userName
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Incorrect userName.'
          });
        }
        if (!(user.password == crypto.decrypt(password, user.passwordKey))) {
          return done(null, false, {
            message: 'Incorrect password.'
          });
        }
        return done(null, user);
      });
    }
  ));
  passport.use(new GoogleStrategy({
    clientID: "1038633096216-vj4dk5dsmtrjrb99hcatgq07q7puo6mr.apps.googleusercontent.com",
    clientSecret: "fCk4eF49tM2sN3aamoukzO1S",
    callbackURL: "http://localhost/auth/google/callback"
  },
    function (accessToken, refreshToken, profile, done) {
      user = {};
      user.userName = profile.id;
      user.firstName = profile.name.familyName;
      user.lastName = profile.name.givenName;
      user.gender = profile.gender;
      user.password = "google";
      User.findOne({ userName: user.userName }, function (err, user1) {
        if (err || !user1)
          User.create(user, function (err, user2) {
            return done(err, user2);
          })
        else
          return done(false, user1);
      })
    }
  ));
  passport.serializeUser(function (user, done) {
    done(null, user.userName);
  });

  passport.deserializeUser(function (uname, done) {
    User.findOne({
      userName: uname
    }, function (err, user) {
      done(err, user);
    });
  });
  app.use(favicon(path.join(__dirname, 'public', 'images', 'dosh.ico')));
  app.use('/users', users);
  app.use('/blogs', blogs);
  app.use('/inbox', inbox);
  app.use('/', login); // register login controller
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
  .catch(err => {
    console.log("Failure: " + err);
    process.exit(0);
  });

module.exports = app;