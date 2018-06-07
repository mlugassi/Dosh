const express = require('express');
const router = express.Router();
const User = require('../model')("User");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require("crypto-js/aes");

// create todo and send back all todos after creation
router.post('/', async (req, res, next) => {
  passport.authenticate('local', { successRedirect: '/' }, function (err, user, info) {
    // var enc = crypto.encrypt("Message", "Key")
    // console.log(enc.toString());
    // console.log(crypto.decrypt("U2FsdGVkX1+qb2/QSQcgUlJns7DArv1VA93ViVh8l3k=", "Key").toString(crypto.Utf8));
    console.log("post to /login");
    if (err)
      return next(err);
    if (!user)
      res.status(200).json({ status: "Fail", message: info.message });
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      console.log("login to: " + user);
      User.findOneAndUpdate({ userName: user.userName }, { passwordKey: "" }, function (err, user) {
        if (!err)
          {console.log("The passwordKey isn't reset")}
      });
      res.status(200).json({ status: "OK", message: "You loged in successfully." });
      //////////return res.status(200).json({ "status": "success" });
    });
  })(req, res, next);
});


router.get('/', async (req, res) => {
  console.log("Get to /login");
  return res.json([{ link: "index.html", name: 'Home' },
  { link: "shop.html", name: 'Catalog' },
  { link: "sale.html", name: 'Manage users' },
  { link: "about.html", name: 'Manage items' },
  { link: "about.html", name: 'About' },
  { link: "contact.html", name: 'Contact' }]);

  // if (req.session === undefined) {
  //   req.session.referer = req.get('Referer');
  //   if (req.session.referer === undefined)
  //     req.session.referer = '/';
  //   res.render("index", { "uname": "", "role": "", "flowers": "" });
  // }
  // else
  //   res.redirect('/');
});

module.exports = router;
