var express = require('express');
var router = express.Router();
var debug = require('debug')('Dosh:inbox');
const User = require('../model')("User");
const Chat = require('../model')("Chat");
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
  console.log("i'm in inbox/getAll");
  User.findOne({ userName: req.session.passport.user }, function (err, response) {
    if (err || !response)
      return res.json([]);
    else
      console.log(response);
    return res.json(response.inbox);
  })
});

router.post('/readInbox', checksession, function (req, res) {
  console.log("i'm in inbox/readInbox")
  if (!req.body.inboxId)
    return res.json({ status: false, message: "Please send the inbox Id you rode." });

  User.update({ userName: req.session.passport.user, "inbox._id": req.body.inboxId },
    { $set: { "inbox.$.isRead": true } }, function (err, response) {
      if (err || !response || !response.nModified)
        return res.json({ status: false, message: "The inbox wasn't updted." });
      else
        return res.json({ status: true, message: "The inbox updte successfully." });
    });
});
router.get('/changeInboxCount', checksession, function (req, res) {
  console.log("------------------------in change new Inbox---------------------------------------------");
  User.findOneAndUpdate({ userName: req.session.passport.user }, { inboxCount: 0 }, function (err, user) {
    if (err || !user)
      return res.json({ status: false, message: "The count wasn't updted." });
    else
      return res.json({ status: true, message: "The count updte successfully to 0." });
  });
});

router.post('/unreadInbox', checksession, function (req, res) {
  console.log("i'm in inbox/unreadInbox")
  if (!req.body.inboxId)
    return res.json({ status: false, message: "Please send the inbox Id you unrode." });
  User.update({ userName: req.session.passport.user, "inbox._id": req.body.inboxId },
    { $set: { "inbox.$.isRead": false } }, function (err, response) {
      if (err || !response || !response.nModified)
        return res.json({ status: false, message: "The inbox wasn't updted." });
      else
        return res.json({ status: true, message: "The inbox updte successfully." });
    });
});

router.post('/delete', checksession, function (req, res) {
  console.log("i'm in inbox/deleteInbox")
  if (!req.body.inboxId)
    return res.json({ status: false, message: "Please send the inbox Id you want to delete." });

  User.update({ userName: req.session.passport.user },
    { $pull: { inbox: { _id: req.body.inboxId } } }, function (err, response) {
      if (err || !response || !response.nModified)
        return res.json({ status: false, message: "The inbox wasn't deleted." });
      else
        return res.json({ status: true, message: "The inbox was deleted." });
    });
});
router.post('/confirmInbox', checksession, function (req, res) {
  console.log("i'm in inbox/confirmInbox");
  console.log(req.body.inboxKind);
  console.log((req.body.inboxKind).startsWith("chat"));

  if (!req.body.inboxId)
    return res.json({ status: false, message: "Please send the inbox Id you confirm." });

  if (req.body.inboxKind == "blog") {
    User.findOneAndUpdate({
      userName: req.session.passport.user, isAdmin: true,
      "inbox._id": req.body.inboxId, "inbox.isConfirm": false
    }, { $set: { "inbox.$.isConfirm": true } },
      function (err, user) {
        if (err || !user)
          return res.json({ status: false, message: "" });
        else {
          let sender;
          user.inbox.forEach(element => {
            if (element._id == req.body.inboxId)
              sender = element.sender;
          });
          User.update({ userName: sender },
            {
              $set: { isBlogger: true },
              $push: { inbox: [{ kind: "other", title: "Your request was confirm", content: "Congregulation!! You are a blogger now!", sender: req.session.passport.user, date: Date.now(), isRead: false, isConfirm: true }] },
              $inc: { inboxCount: 1 }
            }, function (err, response) {
              if (err || !response || !response.nModified)
                return res.json({ status: false, message: "The user wasn't been a blogger." });
              else
                return res.json({ status: true, message: "The user is a blogger now." });
            })
        }
      });
  }
  else if (req.body.inboxKind.startsWith("chat")) {
    chatId = req.body.inboxKind.substring(4, 5);
    console.log("chatId: " + chatId);
    User.findOneAndUpdate({
      userName: req.session.passport.user, isBlogger: true,
      "inbox._id": req.body.inboxId, "inbox.isConfirm": false
    }, { $set: { "inbox.$.isConfirm": true } },
      function (err, user) {
        if (err || !user)
          return res.json({ status: false, message: "" });
        else {
          let sender;
          user.inbox.forEach(element => {
            if (element._id == req.body.inboxId)
              sender = element.sender;
          });

          User.update({ userName: sender },
            {
              $push: { inbox: [{ kind: "other", title: "Your request was confirm", content: "Congregulation!! You joined to the chat " + chatId + "!", sender: req.session.passport.user, date: Date.now(), isRead: false, isConfirm: true }] },
              $inc: { inboxCount: 1 }
            }, function (err, response) {
              if (err || !response || !response.nModified)
                return res.json({ status: false, message: "The user wasn't been a blogger." });
              else
                Chat.findOneAndUpdate({ id: chatId },
                  { $push: { participates: sender } }, function (err, chat) {
                    if (err || !chat)
                      return res.json({ status: true, message: "The user is a join to chat " + chatId + " now." });
                  });
            });
        }
      });
  }
});
router.post('/rejectInbox', checksession, function (req, res) {
  console.log("i'm in inbox/rejectInbox")
  if (!req.body.inboxId)
    return res.json({ status: false, message: "Please send the inbox Id you reject." });
  User.findOneAndUpdate({
    userName: req.session.passport.user,
    "inbox._id": req.body.inboxId, "inbox.isConfirm": false
  }, { $set: { "inbox.$.isConfirm": true } },
    function (err, user) {
      if (err || !user)
        return res.json({ status: false, message: "" });
      else {
        let sender;
        user.inbox.forEach(element => {
          if (element._id == req.body.inboxId)
            sender = element.sender;
        });
        User.update({ userName: sender },
          {
            //$set: { isBlogger: false },
            $push: { inbox: [{ kind: "other", title: "Your request was rejected", content: "", sender: req.session.passport.user, date: Date.now(), isRead: false, isConfirm: true }] },
            $inc: { inboxCount: 1 }
          }, function (err, response) {
            if (err || !response || !response.nModified)
              return res.json({ status: false, message: "Something is went wrong." });
            else
              return res.json({ status: true, message: "The user request was reject." });
          })
      }
    });
});


module.exports = router;
