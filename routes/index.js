var express = require('express');
var router = express.Router();
var debug = require('debug')('Dosh:index');
const User = require('../model')("User");
const checksession = require('./checksession');


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

router.post('/getKey', async (req, res) => {
  console.log("I'm in post /getKey");
  var key = "stam key";
  //user.userName = req.body.userName;
  User.findOneAndUpdate({ userName: req.body.userName }, { passwordKey: key }, function (err, user) {
    if (!err)
      return res.json({ key: key });
  });
});

router.post('/signup', async (req, res, next) => {
  console.log("In singup post");
  console.log(req.body.userName);
  User.findOne({ userName: req.body.userName }, function (err, user) {
    if (err) throw err;
    if (user != null)
      res.status(200).json({ status: "Fail", message: "User Name Alredy Exist" });
    else {
      console.log(req.body);
      var user = {};
      user.firstName = req.body.firstName || "";
      user.lastName = req.body.lastName || "";
      user.userName = req.body.userName;
      user.password = req.body.password;
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
      User.create(user, function (err, user) {
        if (err) throw err;
        console.log('user created:' + user);
        res.status(200).json({ status: "OK", message: "The user " + user.userName + " sucess to signup" });
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