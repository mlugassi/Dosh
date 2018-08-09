var express = require('express');
var router = express.Router();
var debug = require('debug')('Dosh:index');
const User = require('../model')("User");
const Chat = require('../model')("Chat");
const Blog = require('../model')("Blog");
const checksession = require('./checksession');

router.get('/', checksession, function (req, res) {
  res.sendfile('./views/dist/views/index.html');
});

router.get('/getAll', checksession, async (req, res) => {
  let myChats = [];
  let otherChats = [];

  myChatsTemp = await Chat.find({
    isActive: true,
    participates: req.session.passport.user
  }).exec();

  otherChatsTemp = await Chat.find({
    isActive: true,
    participates: {
      $ne: req.session.passport.user
    }
  }).exec();
  for (item of myChatsTemp) {
    if (isNaN(Number(item.id)))
      continue;
    await Blog.findOne({
      id: item.id
    }, function (err, blog) {
      if (err) throw err;
      if (!blog) return;
      newChat = {};
      newChat.id = item.id;
      newChat.owner = item.owner;
      newChat.title = blog.title;
      newChat.likes = blog.likes.count;
      newChat.unlikes = blog.unlikes.count;
      newChat.imgPath = blog.imgPath;
      myChats.push(newChat);
    });
  };
  for (item of otherChatsTemp) {
    if (isNaN(Number(item.id)))
      continue;
    await Blog.findOne({
      id: item.id
    }, function (err, blog) {
      if (err) throw err;
      if (!blog) return;
      newChat = {};
      newChat.id = item.id;
      newChat.owner = item.owner;
      newChat.title = blog.title;
      newChat.likes = blog.likes.count;
      newChat.unlikes = blog.unlikes.count;
      newChat.imgPath = blog.imgPath;
      otherChats.push(newChat);
    });
  };
  img = await User.findOne({
    userName: req.session.passport.user
  }).exec();
  img = img.imgPath;
  return res.status(200).json({
    myChats: myChats,
    otherChats: otherChats,
    user: req.session.passport.user,
    imgPath: img
  });
});

router.get('/search/:id/:index/:expression?', checksession, async (req, res) => {
  mult = 5;
  index = req.params.index;
  if (!req.params.expression)
    req.params.expression = "";
  if (!index)
    index = 1;
  result = (await Chat.findOne({
    isActive: true,
    id: req.params.id
  }));

  console.log(result);
  if (!result)
    return res.json([]);
  size = (result && result.messages) ? result.messages.length : 0;
  if (index * mult > size + mult)
    return res.status(200).json([]);

  var messages = [];
  result = await Chat.findOne({
    isActive: true,
    id: req.params.id
  }, function (err, chat) { });

  if (!result || !result.messages)
    return res.status(200).json([]);

  if (req.params.expression != "" && req.params.expression != undefined) {
    result.messages.forEach(element => {
      if (element.text.includes(req.params.expression) && !element.isImage)
        messages.push(element);
    });
  } else
    messages = result.messages;

  from = messages.length - Math.min(messages.length, index * mult);
  count = +Math.min(messages.length + mult - index * mult, mult);
  var requested_messages = [];
  for (let i = from; i < from + count; i++) {
    requested_messages.push(messages[i]);
  }
  for (element of requested_messages) {
    temp = await User.findOne({
      userName: element.sender
    }).exec();
    element.imgPath = temp.imgPath;
  };
  return res.status(200).json(requested_messages);
});

router.get('/join/:id', checksession, async (req, res) => {
  Chat.findOne({
    id: req.params.id,
    isActive: true,
  }, function (err, chat) {
    if (!err && chat)
      User.update({
        userName: chat.owner,
        isBlogger: true,
        isActive: true
      }, {
          $push: {
            inbox: [{
              kind: "chat" + chat.id,
              title: req.session.passport.user + " what to join to chat " + chat.id,
              content: " ",
              sender: req.session.passport.user,
              date: Date.now(),
              isRead: false,
              isConfirm: false
            }]
          },
          $inc: {
            inboxCount: 1
          }
        },
        function (err, user) {
          if (!err && user)
            return res.json({
              status: true,
              message: "Your request was sent."
            });
          else
            return res.json({
              status: false,
              message: "Something was wrong.\nYour reuest wasn't sent."
            });
        });
    else {
      return res.json({
        status: false,
        message: "Something was wrong.\nYour reuest wasn't sent."
      });
    }
  })
});
module.exports = router;