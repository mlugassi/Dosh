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

/* GET home page. */
router.get('/home', checksession, function (req, res, next) {
  console.log("I'm in the home GET");
  return res.json([[
    { link: "index.html", name: "Home" },
    { link: "shop.html", name: "Catalog" },
    { link: "sale.html", name: "Manage users" },
    { link: "about.html", name: "Manage items" },
    { link: "about.html", name: "About" },
    { link: "contact.html", name: "Contact" }
  ], [{ name: req.session.passport.user }]]);
  //  res.redirect('/login');
});

router.get('/logout', async (req, res) => {
  console.log(req.session.passport.user + ' is logging out');
  req.session.regenerate(err => {
    console.log('logged out');
    res.redirect('/');
  });
});

function generateKey() {
  return create_UUID();
};

router.post('/getKey', async (req, res) => {
  console.log("I'm in post /getKey");
  var key = generateKey();
  //user.userName = req.body.userName;
  await User.findOneAndUpdate({ userName: req.body.userName }, { passwordKey: key }, function (err, user) {
    if (!user) {//The user not exist-->before signup.
      var user1 = {};
      user1.userName = req.body.userName;
      user1.password = " ";
      user1.passwordKey = key;
      console.log("user1: " + user1);
      User.create(user1, function (err, user2) {
        console.log("user2: " + user2);
        if (err)
          return res.json({ status: "Fail", message: "User Name Alredy Exist!\nPlease choose other.", err: err });
        else
          return res.json({ status: "OK", key: key });
      });
    }
    else {
      console.log("user: " + user);
      return res.json({ key: key });
    }
  });
});

router.post('/signup', async (req, res, next) => {
  console.log("In singup post");
  User.findOne({ userName: req.body.userName }, function (err, myUser) {
    if (err) throw err;
    if (myUser == null)
      res.status(200).json({ status: "Fail", message: "You must get a key before." });
    else {
      var user = {};
      user.firstName = req.body.firstName || "";
      user.lastName = req.body.lastName || "";
      user.userName = req.body.userName;
      user.password = crypto.decrypt(req.body.password, myUser.passwordKey);
      user.email = req.body.email || "";
      user.birthDay = new Date(req.body.birthDay || "");
      user.gender = req.body.gender || "Other"; 
      user.isAdmin = req.body.isAdmin || false;
      user.isActive = req.body.isActive || true;
      user.isBlogger = req.body.isBlogger || false;
      user.isResetReq = req.body.isResetReq || false;
      user.imgPath = req.body.imgPath || "../../assets/images/" + user.gender + ".default.jpg" || "";
      user.blogs = req.body.blogs || 0;
      user.inbox = req.body.inbox || [];
      user.uuid = "";
      user.passwordKey = "";
      User.findOneAndUpdate({ userName: user.userName }, user, function (err, user) {
        if (err) throw err;
        console.log('user created:' + user);
        res.status(200).json({ status: "OK", message: "The user " + user.userName + " sucesseed to signup" });
      });
    }
  });
});

router.get('/catalog', checksession, function (req, res, next) {
  console.log("Get to the catalog");
  return res.json([
    { imgPath: "http://placehold.it/500x325", title: "test title 1", subTitle: "test sub-title 1", btnContent: "test button content 1" },
    { imgPath: "http://placehold.it/500x325", title: "test title 2", subTitle: "test sub-title 2", btnContent: "test button content 2" },
    { imgPath: "http://placehold.it/500x325", title: "test title 3", subTitle: "test sub-title 3", btnContent: "test button content 3" },
    { imgPath: "http://placehold.it/500x325", title: "test title 4", subTitle: "test sub-title 4", btnContent: "test button content 4" },
  ]);

  //  res.redirect('/login');
});

router.post('/askToResetPassword', function (req, res) {
  console.log(req.body.email);
  User.findOne({ email: req.body.email, isActive: true }, function (err, result) {
    if (err) throw err;
    if (result != null) {
      (async () => {
        result.uuid = create_UUID();
        result.isResetReq = true;
        User.findOneAndUpdate({ userName: result.userName }, result, function (err, result) {
          if (err) throw err;
        })
        mailOptions.to = req.body.email;
        mailOptions.html = "<p>Hello" + result.userName + ",</p><a href = \"http://localhost:4200/resetPassword/" + result.uuid + "\"> Click here for reset your password</a>";
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ status: "OK", message: "An email will send you in few minutes." });
          }
        });
      })();
    }
    else
      res.status(200).json({ status: "Fail", message: "Email dosn\'t exist" });
  });

});

router.get('/resetPassword/:UUID', function (req, res) {
  console.log("in resetPassword with UUID");
  console.log(req.params.UUID);
  User.findOne({ uuid: req.params.UUID, isActive: true }, function (err, result) {
    if (err)
      condole.log(err);
    if (result != null) {
      console.log(1);
      res.status(200).json({ status:"OK"});
      //res.render('reset_password', { uuid: result.uuid });
    }
    else
    {
      console.log(22);
      res.redirect('/pageNotFound');//.json({status:"Fail"});
    }
  });
});
router.post('/doReset', function (req, res) {
  user = {};
  user.uuid = "";
  user.isResetReq = false;
  user.password = req.body.password;// crypto.decrypt(req.body.password, myUser.passwordKey);
  User.findOneAndUpdate({ isResetReq: true, uuid: req.body.uuid, isActive: true }, user, function (err, result) {
    if (err) console.log(err);
    if (result != null)
      res.status(200).json({status:"OK", message: "Your password chnged.\n please try to log in."});
    else
    res.status(200).json({status:"OK", message: "Something went wrong..\nYour password isn,t changed."});
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