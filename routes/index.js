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

router.post('/signup', async (req, res, next) => {
  console.log("In singup post");
  User.findOne({ userName: req.body.username }, function (err, user) {
    if (err) throw err;
    if (user != null)
      res.status(200).json({ status: "Fail", message: "User Name Alredy Exist" });
    else {
      var user = {};
      user.firstName = req.body.firstName || "";
      user.lastName = req.body.lastName || "";
      user.userName = req.body.userName;
      user.password = req.body.password;
      user.email = req.body.email || "";
      user.role = req.body.role || "";
      if (user.role == "employee")
        user.branch = req.body.branch.split(" ")[0];
      user.gender = req.body.gender || "";
      user.active = req.body.active;
      user.reset = false;
      user.uuid = "";
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