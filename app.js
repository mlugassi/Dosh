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
var fs = require('fs');
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
let chat = require('./routes/chat');
let login = require('./routes/login'); // it will be our controller for logging in/out

var server = require('http').Server(app);
var io = require('socket.io')(server);

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
  app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));
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
          user.userName = profile.emails[0].value.substr(0, profile.emails[0].value.indexOf('@'));
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
            type: "other",
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

  var connected_users = [];
  var files = {},
    struct = {
      name: null,
      type: null,
      size: 0,
      data: [],
      slice: 0,
      room: "",
      id: ""
    };
  io.on('connection', (socket) => {

    console.log('new connection made.');

    socket.on('join', function (data) {
      socket.join(data.room);
      console.log(data.user + ' joined the room : ' + data.room);
      socket.broadcast.to(data.room).emit('new user joined', {
        user: data.user,
        message: 'has joined this room.',
        room: data.room
      });
    });


    socket.on('leave', function (data) {
      console.log(data.user + ' left the room : ' + data.room);
      Chat.update({
        id: data.room,
        isActive: true
      }, {
        $pull: {
          participates: data.user
        },
      }, function (err, chat) {
        if (err) throw err;
      });
      socket.broadcast.to(data.room).emit('left room', {
        user: data.user,
        message: 'has left this room.'
      });
      socket.leave(data.room);
    });

    socket.on('serverConnection', function (data) {
      if (connected_users.filter(user => user.userName == data.user).length == 0) {
        connected_users.forEach(user => {
          socket.broadcast.to(user.userName).emit('new user connected', {
            userName: data.user,
            imgPath: data.imgPath
          });
        })
        connected_users.push({
          userName: data.user,
          imgPath: data.imgPath
        });
      }
      socket.join(data.user);
      console.log(data.user + ' has connected');
      socket.emit('connected users', {
        connected_users: connected_users.filter(user => user.userName != data.user)
      });
    });

    socket.on('like', function (data) {
      let room = isNaN(Number(data.room)) ? data.room.replace(data.user, '').replace('_', '') : data.room;
      console.log("----------------------like----------------");
      console.log("room: " + room + ", user: " + data.user + ", id: " + data.idMessage + ", flag: " + data.flag);
      if (data.flag) {
        Chat.update({
          id: data.room,
          isActive: true,
          "messages._id": data.idMessage
        }, {
          $push: {
            "messages.$.likes": data.user
          },
          $pull: {
            "messages.$.unlikes": data.user
          }
        }, function (err, response) {
          if (err) throw err;
        });
      } else {
        Chat.update({
          id: data.room,
          isActive: true,
          "messages._id": data.idMessage
        }, {
          $pull: {
            "messages.$.likes": data.user
          },
        }, function (err, response) {
          console.log(err);
          console.log(response);
        });
      }
      socket.broadcast.to(room).emit('new like', {
        user: data.user,
        idMessage: data.idMessage,
        flag: data.flag
      });
    });

    socket.on('unlike', function (data) {
      console.log(isNaN(Number(data.room)));
      let room = isNaN(Number(data.room)) ? data.room.replace(data.user, '').replace('_', '') : data.room;
      console.log("----------------------unlike----------------");
      console.log("room: " + data.room + ", user: " + data.user + ", id: " + data.idMessage + ", flag: " + data.flag);
      if (data.flag) {
        Chat.update({
          id: data.room,
          isActive: true,
          "messages._id": data.idMessage
        }, {
          $push: {
            "messages.$.unlikes": data.user
          },
          $pull: {
            "messages.$.likes": data.user
          }
        }, function (err, response) {
          console.log(err);
          console.log(response);
        });
      } else {
        Chat.update({
          id: data.room,
          isActive: true,
          "messages._id": data.idMessage
        }, {
          $pull: {
            "messages.$.unlikes": data.user
          },
        }, function (err, response) {
          console.log(err);
          console.log(response);
        });
      }
      socket.broadcast.to(room).emit('new unlike', {
        user: data.user,
        idMessage: data.idMessage,
        flag: data.flag
      });
    });
    socket.on('message', function (data) {
      let room = isNaN(Number(data.room)) ? data.room.replace(data.sender, '').replace('_', '') : data.room;
      Chat.findOneAndUpdate({
        id: data.room,
        isActive: true,
      }, {
        $push: {
          messages: [data]
        }
      }, function (err, updatedChat) {
        if (err) throw err;
        if (updatedChat) {
          console.log("updatedChat not null");
          Chat.findOne({
            id: data.room,
            isActive: true
          }, function (err, newChat) {
            if (err) throw err;
            data._id = newChat.messages.pop()._id;
            socket.to(room).emit('new message', data);
            socket.emit('new message', data);
          });
        } else Chat.create({
          id: data.room,
          participates: [data.sender, room],
          messages: [data],
          isActive: true
        }, function (err, newChat) {
          if (err) throw err;
          if (!newChat) return;
          data._id = newChat.messages.pop()._id;
          socket.to(room).emit('new message', data);
          socket.emit('new message', data);
        });
      });
    });

    socket.on('uploadImage', function (data) {
      if (!files[data.name]) {
        files[data.name] = Object.assign({}, struct, data);
        files[data.name].data = [];
        files[data.name].id = data.id;
        files[data.name].room = isNaN(Number(data.room)) ? data.room.replace(data.sender, '').replace('_', '') : data.room;
      }
      data.data = new Buffer(new Uint8Array(data.data));
      files[data.name].data.push(data.data);
      files[data.name].slice++;

      if (files[data.name].slice * 100000 >= files[data.name].size) {

        var fileBuffer = Buffer.concat(files[data.name].data);
        fs.writeFile('public' + data.name, fileBuffer, (err) => {
          if (err) throw err;
          socket.to(files[data.name].room).emit('end upload', {
            id: files[data.name].id,
            imgPath: data.name
          });
          socket.emit('end upload', {
            id: files[data.name].id,
            imgPath: data.name
          });
          delete files[data.name];
          console.log('end upload');
        });

      } else
        socket.emit('request slice upload', {
          fileName: data.name,
          currentSlice: files[data.name].slice
        });
    });

    socket.on('serverDisconnection', function (data) {
      if (connected_users.filter(user => user.userName == data.user).length == 0) return;
      socket.leave(data.user);
      console.log(data.user + ' has disconnected');
      connected_users = connected_users.filter(user => user.userName != data.user);
      connected_users.forEach(user => {
        socket.broadcast.to(user.userName).emit('disconnected user', {
          userName: data.user
        });
      });
    });
  });
  server.listen(80);
  console.log('80 is the magic port');
})()
.catch(err => {
  console.log("Failure: " + err);
  process.exit(0);
});

process.on('uncaughtException', function(err) {
  console.log('-------------------Exception-----------------');
  console.log('Caught exception: ' + err);
  console.log('---------------------------------------------');
});

module.exports = app;