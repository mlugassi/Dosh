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
var path = require('path');
var crypto = require("crypto-js/aes");
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./model')("User");
const Chat = require('./model')("Chat");
var app = express();
let index = require('./routes/index');
let users = require('./routes/users');
let blogs = require('./routes/blogs');
let inbox = require('./routes/inbox');
let chat  = require('./routes/chat');
let login = require('./routes/login'); // it will be our controller for logging in/out

var server = require('http').Server(app);
var io = require('socket.io')(server);
// chat1 = {};
// chat1.id = 3;
// chat1.owner = "sapirz1";
// chat1.participates = ["sapirz1","shilatz1"];
// chat1.messages = [{text:"Bla bla bla1",sender:"refaelz1",date: Date.now(), likes:{count:6,users:["refaelz1"]},unlike:{count:0,users:[]}},
// {text:"Bla bla bla1",sender:"shilatz1",date:Date.now(), likes:{count:6,users:["refaelz1"]},unlike:{count:0,users:[]}},
// {text:"Bla bla bla2",sender:"shilatz1",date:Date.now(), likes:{count:0,users:["refaelz1"]},unlike:{count:0,users:[]}},
// {text:"Bla bla bla3",sender:"sapirz1",date:Date.now(), likes:{count:5,users:["refaelz1"]},unlike:{count:0,users:[]}},
// {text:"Bla bla bla4",sender:"shilatz1",date:Date.now(), likes:{count:2,users:["refaelz1","sapirz1"]},unlike:{count:3,users:[]}},
// {text:"Bla bla bla5",sender:"sapirz1",date:Date.now(), likes:{count:7,users:["refaelz1"]},unlike:{count:0,users:[]}},
// {text:"Bla bla bla6",sender:"shilatz1",date:Date.now(), likes:{count:2,users:["refaelz1","sapirz1"]},unlike:{count:5,users:[]}}];
// Chat.create(chat1);

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
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
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({
    extended: false
  })); // support encoded bodies

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
    clientID: "1038633096216-p5iebk1r91lum4804bic3mhpu1ig92vc.apps.googleusercontent.com",
    clientSecret: "FFRtdwr4rYnvh5n7lYrBf3SM",
    callbackURL: "/auth/google/callback"
  },
    function (accessToken, refreshToken, profile, done) {
      //      console.log(profile);
      User.findOne({
        userName: profile.id
      }, function (err, user1) {
        if (err || !user1) {
          user = {};
          user.userName = profile.id;
          user.firstName = profile.name.givenName;
          user.lastName = profile.name.familyName;
          user.gender = profile.gender || "male";
          user.email = profile.emails[0].value;
          user.birthDay = new Date();
          user.isAdmin = false;
          user.isActive = true;
          user.isBlogger = false;
          user.isResetReq = false;
          user.password = "google";
          user.imgPath = "/images/users_profiles/" + user.gender + ".default.jpg" || "";
          user.blogs = 0;
          user.inbox = [{
            title: "Welcome to our blog site",
            content: "We exiting for your join",
            sender: "System",
            date: Date.now(),
            isRead: false,
            isConfirm: true
          }];
          user.inboxCount = 1;
          User.create(user, function (err, user2) {
            return done(err, user2);
          })
        } else
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
  //app.use('/', express.static(path.join(__dirname, 'views', 'dist', 'views')));

  app.use('/users', users);
  app.use('/blogs', blogs);
  app.use('/inbox', inbox);
  app.use('/chat', chat);
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

  io.on('connection', (socket) => {

    console.log('new connection made.');


    socket.on('join', function (data) {
      //joining
      socket.join(data.room);

      console.log(data.user + ' joined the room : ' + data.room);

      socket.broadcast.to(data.room).emit('new user joined', { user: data.user, message: 'has joined this room.' });
    });


    socket.on('leave', function (data) {
      console.log(data.user + ' left the room : ' + data.room);
      socket.broadcast.to(data.room).emit('left room', { user: data.user, message: 'has left this room.' });
      socket.leave(data.room);
    });

    socket.on('message', function (data) {

      io.in(data.room).emit('new message', { user: data.user, message: data.message });
    })
  });
  server.listen(80);
  console.log('80 is the magic port');
})()
  .catch(err => {
    console.log("Failure: " + err);
    process.exit(0);
  });

module.exports = app;