var express = require('express');
var router = express.Router();
var debug = require('debug')('Dosh:index');
const User = require('../model')("User");
const checksession = require('./checksession');
var crypto = require("crypto-js/aes");
var nodemailer = require('nodemailer');

var mailOptions = {
  from: 'DONTREPLAY@RMflowers.com',
  subject: 'Reset Password',
};

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mlugassi@g.jct.ac.il',
    pass: '3398088Ml'
  }
});

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

function generateKey() {
  return create_UUID();
};

router.post('/getKey', async (req, res) => {
  if (!req.body || !req.body.userName)
    return res.json({ status: false, message: "Somthing missed up" });
  console.log("I'm in post /getKey");
  var key = generateKey();
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
  if (!req.params || !req.params.UUID)
    return res.json({ status: false, message: "Somthing missed up" });
  console.log("I'm in get /getKey");
  var key = generateKey();
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

router.post('/askToResetPassword', function (req, res) {
  if (!req.body || !req.body.email)
    return res.json({ status: false, message: "Somthing missed up" });
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
      mailOptions.html = "<p>Hello " + result.userName + ",</p><a href = \"http://localhost/resetPassword/" + result.uuid + "\"> Click here for reset your password</a>";
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
      console.log(err);
      res.redirect('/pageNotFound');
    }
    else
      res.sendfile('./views/dist/views/index.html');
  });
});
router.post('/doReset', function (req, res) {
  if (!req.body || !req.body.uuid || !req.body.password)
    return res.json({ status: false, message: "Somthing missed up" });

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
