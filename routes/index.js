var express = require('express');
var router = express.Router();
var debug = require('debug')('Dosh:index');
const User = require('../model')("User");
const checksession = require('./checksession');
var crypto = require("crypto-js/aes");
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mlugassi@g.jct.ac.il',
    pass: '3398088Ml'
  }
});

var mailOptions = {
  from: 'DONTREPLAY@RMflowers.com',
  subject: 'Reset Password',
};

router.get('/check_session', function (req, res) {
  let status = false;
  if (req.session != undefined && req.session.passport != undefined && req.session.passport.user != undefined)
    status = true;
  res.status(200).json({
    status: status
  });
});

/* GET home page. */
router.get('/', checksession, function (req, res) {
  res.sendfile('./views/dist/views/index.html');
});
router.get('/contact', checksession, function (req, res) {
  res.sendfile('./views/dist/views/index.html');
});
router.get('/contactUS', function (req, res) {
  res.sendfile('./views/dist/views/index.html');
});
router.get('/about', checksession, function (req, res) {
  res.sendfile('./views/dist/views/index.html');
});
router.get('/aboutUS', function (req, res) {
  res.sendfile('./views/dist/views/index.html');
});

router.get('/logout', checksession, async (req, res) => {
  console.log(req.session.passport.user + ' is logging out');
  req.session.regenerate(err => {
    console.log('logged out');
    res.redirect('/login');
  });
});

function generateKey() {
  return create_UUID();
};

router.post('/getKey', async (req, res) => {
  if (req.body == undefined)
    return res.json({ status: false, message: "Somthing missed up" });
  console.log("I'm in post /getKey");
  var key = generateKey();
  //user.userName = req.body.userName;
  User.findOneAndUpdate({
    userName: req.body.userName
  }, {
      passwordKey: key
    }, function (err, user) {
      if (err || !user) { //The user not exist-->before signup.
        User.create({ userName: req.body.userName, password: " ", passwordKey: key }, function (err, user2) {
          if (err || !user2)
            return res.json({
              status: false,
              message: "User Name Alredy Exist!\nPlease choose other.",
              err: err
            });
        });
      }
      return res.json({ status: true, key: key });
    });
});
router.get('/getKey/:UUID', async (req, res) => {
  console.log("I'm in get /getKey");
  var key = generateKey();
  //user.userName = req.body.userName;
  await User.findOneAndUpdate({
    uuid: req.params.UUID
  }, {
      passwordKey: key
    }, function (err, user) {
      if (!user) //The UUID/user isn't exist.
        return res.json({ status: false, message: "The UUID isn't exist!" });
      else {
        return res.json({ status: true, key: key });
      }
    });
});

router.post('/signup', async (req, res, next) => {
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
      user.imgPath = req.body.imgPath || "/images/users_profiles" + user.gender + ".default.jpg" || "";
      user.blogs = req.body.blogs || 0;
      user.inbox = [{ title: "Welcome to our blog site", content: "We exiting for your join", sender: "System", date: Date.now(), isRead: false, isConfirm: true}];
      user.inboxCount = 1;
      user.uuid = "";
      user.passwordKey = "";
      User.findOneAndUpdate({
        userName: user.userName
      }, user, function (err, user) {
        if (err || !user)  return res.status(200).json({
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

router.post('/askToResetPassword', function (req, res) {
  console.log(req.body.email);
  User.findOne({ email: req.body.email, isActive: true }, function (err, result) {
    if (err || !result)
      return res.status(200).json({
        status: false,
        message: "Your email isn't exist."
      });
    (async () => {
      result.uuid = create_UUID();
      //result.key=create_UUID();
      result.isResetReq = true;
      User.findOneAndUpdate({
        userName: result.userName
      }, result, function (err, result) {
        if (err) return res.status(200).json({
          status: false,
          message: "Something missed up.."
        });
      })
      mailOptions.to = req.body.email;
      mailOptions.html = "<p>Hello" + result.userName + ",</p><a href = \"http://localhost/resetPassword/" + result.uuid + "\"> Click here for reset your password</a>";
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).json({
            status: true,
            message: "An email will send you in few minutes."
          });
        }
      });
    })();
  });
});

router.get('/resetPassword/:UUID', function (req, res) {
  console.log("in resetPassword with UUID");
  User.findOne({
    uuid: req.params.UUID,
    isActive: true
  }, function (err, result) {
    if (err || !result) {
      condole.log(err);
      res.redirect('/pageNotFound');
    }
    else
      res.sendfile('./views/dist/views/index.html');
  });
});
router.post('/doReset', function (req, res) {
  User.findOne({
    isResetReq: true,
    uuid: req.body.uuid
  }, function (err, result) {
    user = {};
    user.uuid = "";
    user.isResetReq = false;
    user.password = crypto.decrypt(req.body.password, result.passwordKey);
    user.passwordKey = "";
    User.findOneAndUpdate({
      isResetReq: true,
      uuid: req.body.uuid,
      isActive: true
    }, user, function (err, newUser) {
      if (err || !newUser)
        return res.status(200).json({
          status: false,
          message: "Something went wrong..\nYour password isn't changed."
        });
      else
        res.status(200).json({
          status: true,
          message: "Your password was changed.\nplease try to log in."
        });
    });
  });
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
