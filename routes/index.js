var express = require('express');
var router = express.Router();
var debug = require('debug')('Dosh:index');
const User = require('../model')("User");
const checksession = require('./checksession');
var crypto = require("crypto-js/aes");


/* GET home page. */
router.get('/navbar', checksession, function (req, res, next) {
  console.log("I'm in the navbar GET");
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
  return "Stam Key";
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
          return res.json({ status: "Fail", message: "User Name Alredy Exist!\nPlease choose other.", err:err });
        else
          return res.json({ status: "OK", key: key });
      });
    }
    else {
      console.log("user: "+user);
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
      user.birthday = new Date(req.body.birthday || "");
      user.gender = req.body.gender || "Other"; 
      user.isAdmin = req.body.isAdmin || false;
      user.isActive = req.body.isActive || true;
      user.isBlogger = req.body.isBlogger || false;
      user.isResetReq = req.body.isResetReq || false;
      user.imgPath = req.body.imgPath || user.gender + ".jpg" || "";
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

module.exports = router;