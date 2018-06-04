var express = require('express');
var router = express.Router();
var debug = require('debug')('Dosh:index');
const checksession = require('./checksession');


/* GET home page. */
router.get('/stam',checksession, function (req, res, next) {
  console.log("I'm in the stam GET");
  return res.json([
    { link: "index.html", name: "Home" },
    { link: "shop.html", name: "Catalog" },
    { link: "sale.html", name: "Manage users" },
    { link: "about.html", name: "Manage items" },
    { link: "about.html", name: "About" },
    { link: "contact.html", name: "Contact" }
  ]);
  //  res.redirect('/login');
});

module.exports = router;