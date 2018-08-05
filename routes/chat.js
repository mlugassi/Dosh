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
  chats = [];
  myChats = await Chat.find({
    participates: req.session.passport.user
  }).exec();
  for (item of myChats) {
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
      chats.push(newChat);
    });
  };
  img = await User.findOne({
    userName: req.session.passport.user
  }).exec();
  img = img.imgPath;
  return res.status(200).json({
    chats: chats,
    user: req.session.passport.user,
    imgPath: img
  });
});
router.get('/messages/:id/:index', checksession, async (req, res) => {
  console.log("get messages");
  mult = 5;
  index = req.params.index;
  if (!index)
    index = 1;
  size = (await Chat.findOne({ id: req.params.id })).messages.length;

  if (index * mult > size + mult)
    return res.status(200).json([]);

  from = Math.min(index * mult, size) * -1;
  count = size > (index * mult) ? mult : size + mult - (index * mult);
  console.log(from);
  console.log(count);
  myChat = await Chat.findOne({
    id: req.params.id,
    participates: req.session.passport.user
  }, {
      messages: {
        $slice: [from, count]
      }
    }, function (err, chat) { });
  for (element of myChat.messages) {
    temp = await User.findOne({
      userName: element.sender
    }).exec();
    element.imgPath = temp.imgPath;
  };
  return res.status(200).json(myChat.messages);
});

router.get('/search/:id/:index/:expression?', checksession, async (req, res) => {
  mult = 5;
  index = req.params.index;
  if (!req.params.expression)
    req.params.expression = "";
  if (!index)
    index = 1;
  size = (await Chat.findOne({ id: req.params.id })).messages.length;

  if (index * mult > size + mult)
    return res.status(200).json([]);

  from = Math.min(index * mult, size) * -1;
  count = size > (index * mult) ? mult : size + mult - (index * mult);

  var messages = [];
  result = await Chat.findOne({
    id: req.params.id
  }, function (err, chat) { });
  console.log("expression= " + req.params.expression);
  if (req.params.expression != "" && req.params.expression!=undefined) {
    result.messages.forEach(element => {
      if (element.text.includes(req.params.expression) && !element.isImage)
        messages.push(element);
    });
  }
  else
    messages = result.messages;

  var m = [];
  console.log("i= " + (messages.length - Math.min(messages.length, index * mult)));
  console.log("ad = " + Math.min(messages.length + mult - index * mult, mult));
  for (let i = j = messages.length - Math.min(messages.length, index * mult);
    i < j + Math.min(messages.length + mult - index * mult, mult); i++) {
    console.log("i = " + i);
    m.push(messages[i]);
  }
  for (element of m) {
    temp = await User.findOne({
      userName: element.sender
    }).exec();
    element.imgPath = temp.imgPath;
  };
  return res.status(200).json(m);
});




router.get('/:id', checksession, function (req, res) {
  res.sendfile('./views/dist/views/index.html');
});
module.exports = router;