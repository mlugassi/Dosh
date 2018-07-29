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
  myChats = await Chat.find({ participates: req.session.passport.user }).exec();
  for (item of myChats) {
    await Blog.findOne({ id: item.id }, function (err, blog) {
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
  return res.status(200).json(chats);
});
router.get('/messages/:id/:index', checksession, async (req, res) => {
  mult = 5;
  if (!req.params.index)
    req.params.index = 1;
  size = (await Chat.findOne({ id: req.params.id })).messages.length;
  from = req.params.index * -1 * mult;
  count = mult;
  if (size < from * -1) {
    count = size + from + mult;
    console.log(count);
    from = -1 * size;
    console.log(from);
  }
  myChat = await Chat.findOne({ id: req.params.id, participates: req.session.passport.user },
    { messages: { $slice: [from, count] } }, function (err, chat) {

    });
  for (element of myChat.messages) {
    temp = await User.findOne({ userName: element.sender }).exec();
    element.imgPath = temp.imgPath;
  };
  img = await User.findOne({ userName: req.session.passport.user }).exec();
  img = img.imgPath;
  return res.status(200).json({ messages: myChat.messages, userName: req.session.passport.user, imgPath: img });
});

router.get('/:id', checksession, function (req, res) {
  res.sendfile('./views/dist/views/index.html');
});
module.exports = router;