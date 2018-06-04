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
  ],[{name:req.session.passport.user}]);
  //  res.redirect('/login');
});

router.get('/catalog', function(req, res, next) {
  console.log("Get to the catalog");
  res.sendfile('./views/src/index.html');
  return res.json([
    {imgPath: "http://placehold.it/500x325" , title: "test title 1" , subTitle: "test sub-title 1" , btnContent: "test button content 1" },
    {imgPath: "http://placehold.it/500x325" , title: "test title 2" , subTitle: "test sub-title 2" , btnContent: "test button content 2" },
    {imgPath: "http://placehold.it/500x325" , title: "test title 3" , subTitle: "test sub-title 3" , btnContent: "test button content 3" },
    {imgPath: "http://placehold.it/500x325" , title: "test title 4" , subTitle: "test sub-title 4" , btnContent: "test button content 4" },
]);

  //  res.redirect('/login');
});

module.exports = router;