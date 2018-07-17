const express = require('express');
const router = express.Router();
const User = require('../model')("User");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require("crypto-js/aes");
const checksession = require('./checksession');

// create todo and send back all todos after creation
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { successRedirect: '/' }, function (err, user, info) {
    if (err)
      res.status(200).json({ status: false, message: err });
    if (!user)
      res.status(200).json({ status: false, message: info.message });
    else {
      req.logIn(user, function (err) {
        if (err) { res.status(200).json({ status: false, message: err }); }
        console.log("login to: " + user);
        User.findOneAndUpdate({ userName: user.userName }, { passwordKey: "" }, function (err, user) {
          if (err || !user) { console.log("The passwordKey isn't reset") }
        });
        res.status(200).json({ status: true, message: "You loged in successfully." });
      });
    }
  })(req, res, next);
});

router.get('/google', passport.authenticate('google', {
  scope: ['profile'],
}));
router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.send("Im here in auth");
});
router.post('/signup', async (req, res, next) => {
  if (!req.body || !req.body.userName || !req.body.firstName || !req.body.email
    || !req.body.birthDay || !req.body.userName || !req.body.password || !req.body.gender)
    return res.json({ status: false, message: "Somthing missed up" });
  console.log("In singup");
  User.findOne({
    userName: req.body.userName
  }, function (err, myUser) {
    if (err || !myUser)
      res.status(200).json({ status: false, message: "You must to get a key before." });
    else {
      var user = {};
      user.firstName = req.body.firstName || "";
      user.lastName = req.body.lastName || "";
      user.userName = req.body.userName;
      user.password = crypto.decrypt(req.body.password, myUser.passwordKey);
      user.email = req.body.email || "";
      user.birthDay = new Date(req.body.birthDay || "");
      user.gender = req.body.gender || "Other";
      user.isAdmin = false;
      user.isActive = true;
      user.isBlogger = false;
      user.isResetReq = false;
      user.imgPath = "/images/users_profiles" + user.gender + ".default.jpg" || "";
      user.blogs = 0;
      user.inbox = [{ title: "Welcome to our blog site", content: "We exiting for your join", sender: "System", date: Date.now(), isRead: false, isConfirm: true }];
      user.inboxCount = 1;
      user.uuid = "";
      user.passwordKey = "";
      User.findOneAndUpdate({
        userName: user.userName
      }, user, function (err, user) {
        if (err || !user) return res.status(200).json({
          status: true,
          message: "Failed to signup",
        });
        console.log('user created:' + user);
        if (req.body.isBlogger) {
          User.update({ isAdmin: true, isActive: true }, { $push: { inbox: [{ title: "Request for blogger", content: "I want to be a blogger", sender: user.userName, date: Date.now(), isRead: false, isConfirm: false }] }, $inc: { inboxCount: 1 } },
            function (err, admin) {
              if (!err && admin) {
                return res.status(200).json({
                  status: true,
                  message: "The user " + user.userName + " sucesseed to signup\nYour request for blogger was sent",
                });
              }
            });
        }
        else {
          return res.status(200).json({
            status: true,
            message: "The user " + user.userName + " sucesseed to signup"
          });
        }
      });
    }
  });
});

router.get('/logout', checksession, async (req, res) => {
  console.log(req.session.passport.user + ' is logging out');
  req.session.regenerate(err => {
    console.log('logged out');
    res.redirect('/login');
  });
});

router.get('/login', (req, res) => {
  console.log("In get /login");
  if (req.session == undefined || req.session.passport == undefined || req.session.passport.user == undefined)
    res.sendfile('./views/dist/views/index.html');
  else
    res.redirect('/');
});

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}


module.exports = router;
