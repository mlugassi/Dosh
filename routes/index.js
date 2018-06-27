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
// User.findOneAndUpdate({userName:"refaelz1"},{inbox:[
//   {title:"Ask blogger",content:"stam1",sender:"sapirz1",date: Date(),isRead:false},
//   {title:"Ask admin",content:"stam1",sender:"shilatz1",date: Date(),isRead:false},
//   {title:"Ask admin2",content:"stam2",sender:"shilatz1",date: Date(),isRead:false},
//   {title:"Ask blogger2",content:"stam2",sender:"sapirz1",date: Date(),isRead:false},
//   {title:"Ask blogger3",content:"stam3",sender:"sapirz1",date: Date(),isRead:false},
//   {title:"Ask admin3",content:"stam3",sender:"shilatz1",date: Date(),isRead:false}]},
//   function(err,user){
// });
/* GET home page. */
router.get('/', checksession, function (req, res) {
  res.sendfile('./views/dist/views/index.html');
});

router.get('/logout', async (req, res) => {
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
  console.log("I'm in post /getKey");
  var key = generateKey();
  //user.userName = req.body.userName;
  User.findOneAndUpdate({
    userName: req.body.userName
  }, {
      passwordKey: key
    }, function (err, user) {
      if (!user) { //The user not exist-->before signup.
        var user1 = {};
        user1.userName = req.body.userName;
        user1.password = " ";
        user1.passwordKey = key;
        console.log("user1: " + user1);
        User.create(user1, function (err, user2) {
          console.log("user2: " + user2);
          if (err)
            return res.json({
              status: "Fail",
              message: "User Name Alredy Exist!\nPlease choose other.",
              err: err
            });
          else
            return res.json({
              status: "OK",
              key: key
            });
        });
      } else {
        console.log("user: " + user);
        return res.json({
          key: key
        });
      }
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
      if (!user) //The user not exist.
        return res.json({
          key: key,
          message: "The UUID isn't exist!"
        });
      else {
        console.log("user: " + user);
        return res.json({
          key: key
        });
      }
    });
});

router.post('/signup', async (req, res, next) => {
  console.log("In singup post");
  User.findOne({
    userName: req.body.userName
  }, function (err, myUser) {
    if (err) throw err;
    if (myUser == null)
      res.status(200).json({
        status: "Fail",
        message: "You must get a key before."
      });
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
      user.inbox = req.body.inbox || [];
      user.uuid = "";
      user.passwordKey = "";
      User.findOneAndUpdate({
        userName: user.userName
      }, user, function (err, user) {
        if (err) throw err;
        console.log('user created:' + user);
        var message = [];
        if (req.body.isBlogger)
          message.push({ title: "Request for blogger", content: "I want to be a blogger", sender: user.userName, date: Date.now(), isRead: false, isConfirm: false });
        if (req.body.isAdmin)
          message.push({ title: "Request for admin", content: "I want to be an admin", sender: user.userName, date: Date.now(), isRead: false, isConfirm: false });

        if (req.body.isBlogger || req.body.isAdmin) {
          User.update({ isAdmin: true, isActive: true }, { $push: { inbox: message },$inc:{inboxCount:1} },
            function (err, user) {
              if (!err && user) {
                res.status(200).json({
                  status: "OK",
                  message: "The user " + user.userName + " sucesseed to signup",
                  requestMessage: "Your request was sent."
                });
              }
            });
        }
        else {
          res.status(200).json({
            status: "OK",
            message: "The user " + user.userName + " sucesseed to signup"
          });
        }
      });
    }
  });
});

router.get('/catalog', checksession, function (req, res, next) {
  console.log("Get to the catalog");
  return res.json([{
    imgPath: "http://placehold.it/500x325",
    title: "test title 1",
    subTitle: "test sub-title 1",
    btnContent: "test button content 1"
  },
  {
    imgPath: "http://placehold.it/500x325",
    title: "test title 2",
    subTitle: "test sub-title 2",
    btnContent: "test button content 2"
  },
  {
    imgPath: "http://placehold.it/500x325",
    title: "test title 3",
    subTitle: "test sub-title 3",
    btnContent: "test button content 3"
  },
  {
    imgPath: "http://placehold.it/500x325",
    title: "test title 4",
    subTitle: "test sub-title 4",
    btnContent: "test button content 4"
  },
  ]);

  //  res.redirect('/login');
});

router.post('/askToResetPassword', function (req, res) {
  console.log(req.body.email);
  User.findOne({
    email: req.body.email,
    isActive: true
  }, function (err, result) {
    if (err) throw err;
    if (result != null) {
      (async () => {
        result.uuid = create_UUID();
        //result.key=create_UUID();
        result.isResetReq = true;
        User.findOneAndUpdate({
          userName: result.userName
        }, result, function (err, result) {
          if (err) throw err;
        })
        mailOptions.to = req.body.email;
        mailOptions.html = "<p>Hello" + result.userName + ",</p><a href = \"http://localhost/resetPassword/" + result.uuid + "\"> Click here for reset your password</a>";
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({
              status: "OK",
              message: "An email will send you in few minutes."
            });
          }
        });
      })();
    } else
      res.status(200).json({
        status: "Fail",
        message: "Email dosn\'t exist"
      });
  });

});

router.get('/resetPassword/:UUID', function (req, res) {
  console.log("in resetPassword with UUID");
  console.log(req.params.UUID);
  User.findOne({
    uuid: req.params.UUID,
    isActive: true
  }, function (err, result) {
    if (err)
      condole.log(err);
    if (result != null) {
      res.sendfile('./views/dist/views/index.html');
    } else {
      res.redirect('/pageNotFound'); //.json({status:"Fail"});
    }
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
      if (err) console.log(err);
      if (newUser != null)
        res.status(200).json({
          status: "OK",
          message: "Your password chnged.\n please try to log in."
        });
      else
        res.status(200).json({
          status: "OK",
          message: "Something went wrong..\nYour password isn,t changed."
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
