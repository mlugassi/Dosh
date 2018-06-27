var express = require('express');
var router = express.Router();
var debug = require('debug')('Dosh:inbox');
const User = require('../model')("User");
const checksession = require('./checksession');

// User.findOneAndUpdate({ userName: "refaelz1" }, {
//   inbox: [
//     { title: "Ask blogger", content: "stam1", sender: "sapirz1", date: Date(), isRead: false, isConfirm: false },
//     { title: "Ask admin", content: "stam1", sender: "shilatz1", date: Date(), isRead: false, isConfirm: false },
//     { title: "Ask admin2", content: "stam2", sender: "shilatz1", date: Date(), isRead: false, isConfirm: true },
//     { title: "Ask blogger2", content: "stam2", sender: "sapirz1", date: Date(), isRead: false, isConfirm: false },
//     { title: "Ask blogger3", content: "stam3", sender: "sapirz1", date: Date(), isRead: false, isConfirm: true },
//     { title: "Ask admin3", content: "stam3", sender: "shilatz1", date: Date(), isRead: false, isConfirm: true }]
// },
//   function (err, user) {
//   });

router.get('/', checksession, function (req, res) {
  res.sendfile('./views/dist/views/index.html');
});

router.get('/gatAll', checksession, function (req, res) {
  console.log("i'm in inbox/inbox")
  User.findOne({ userName: req.session.passport.user }, function (err, user) {
    console.log(user);
    return res.json(user.inbox);
  })
});

router.post('/readInbox', checksession, function (req, res) {
  console.log("i'm in inbox/readInbox")
  User.update({ userName: req.session.passport.user, "inbox._id": req.body.inboxId },
    { $set: { "inbox.$.isRead": true } }, function (err, user) {
      console.log(err);
      console.log(user);
      return res.json({ status: "OK" });
    });
});
router.get('/changeNewInbox',checksession,function(req,res){
  console.log("------------------------in change new Inbox---------------------------------------------");
  User.findOneAndUpdate({userName:req.session.passport.user},{newInbox:false},function(err,user){
    console.log(err);
    console.log(user);
  });
  res.status(200).json({status:true});
});
router.post('/unreadInbox', checksession, function (req, res) {
  console.log("i'm in inbox/unreadInbox")
  User.update({ userName: req.session.passport.user, "inbox._id": req.body.inboxId },
    { $set: { "inbox.$.isRead": false } }, function (err, user) {
      console.log(err);
      console.log(user);
      return res.json({ status: "OK" });
    });
});
router.post('/confirmInbox', checksession, function (req, res) {
  console.log("i'm in inbox/confirmInbox")
  User.findOne({ userName: req.session.passport.user }, function (err, user) {
    var sender;
    user.inbox.forEach(element => {
      if (element._id == req.body.inboxId) {
        if (element.isConfirm) return res.json({ status: false });
        sender = element.sender;
      }
    });
    User.findOneAndUpdate({ userName: sender }, { isBlogger: true }, function (err, user) {
      if (!err && user) {
        User.update({ userName: req.session.passport.user, "inbox._id": req.body.inboxId },
          { $set: { "inbox.$.isConfirm": true } },function(err,user){console.log(user)});
        var message = [{ title: "Your request was confirm", content: "Congregulation!! You are a blogger now!", sender: req.session.passport.user, date: Date.now(), isRead: false, isConfirm: true }];
        User.update({ userName: sender }, { $push: { inbox: message }, $set:{newInbox:true} },function(err,user){console.log(user)});
        return res.json({ status: true });
      }
    })
    console.log(sender);
  });
});
router.post('/delete', checksession, function (req, res) {
  console.log("i'm in inbox/deleteInbox")
  console.log(req.body.inboxId);
  User.update({ userName: req.session.passport.user },
    { $pull: { inbox: { _id: req.body.inboxId } } }, function (err, user) {
      console.log(err);
      console.log(user);
      return res.json({ status: "OK" });
    });
});
router.post('/rejectInbox', checksession, function (req, res) {
  try {
    console.log("i'm in inbox/rejectInbox")
    User.findOne({ userName: req.session.passport.user }, function (err, user) {
      var sender, title;
      user.inbox.forEach(element => {
        if (element._id == req.body.inboxId) {
          sender = element.sender;
          title = element.title;
        }
      });
      if (title == "Your request was rejected") {
        User.update({ userName: req.session.passport.user, "inbox._id": req.body.inboxId },
          { $set: { "inbox.$.isConfirm": true } }, function (err, user) {
            return res.json({ status: "OK" });
          });
      }
      var message = [{ title: "Your request was rejected", content: "", sender: req.session.passport.user, date: Date.now(), isRead: false, isConfirm: true }];
      User.update({ userName: sender }, { $push: { inbox: message },$set:{newInbox:true} },
        function (err, user) {
          if (!err && user) {
            User.update({ userName: req.session.passport.user, "inbox._id": req.body.inboxId },
              { $set: { "inbox.$.isConfirm": true } }, function (err, user) {
                return res.json({ status: "OK" });
              });
          }
        });
    });
  }
  catch (err) {
    console.log(err);
  }
});


module.exports = router;
