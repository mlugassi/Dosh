const express = require('express');
const router = express.Router();
const User = require('../model')("User");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// create todo and send back all todos after creation
router.post('/', async (req, res, next) => {
  passport.authenticate('local', { successRedirect: '/' }, function (err, user, info) {
    if (err)
      return next(err);
    if (!user)
      res.status(200).json({ status: "Fail", message: info.message });
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      console.log("login to: " + user);
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

router.get('/logout', async (req, res) => {
  console.log(req.session.passport.user + ' is logging out');
  req.session.regenerate(err => {
    console.log('logged out');
    res.redirect('/');
  });
});

module.exports = router;
