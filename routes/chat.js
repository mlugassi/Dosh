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
    await Blog.findOne({ id: 1 }, function (err, blog) {
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
  console.log("chats: ");
  console.log(chats);
  return res.status(200).json(chats);
});
router.get('/messages/:id', checksession, async (req, res) => {
  myChat = await Chat.findOne({ id: req.params.id }, function (err, chat) {

  });
  for (element of myChat.messages) {
    temp = await User.findOne({ userName: element.sender }).exec();//"\\images\\blogs\\1.jpg"
    console.log(temp.imgPath);
    element.imgPath = temp.imgPath;
  };
  console.log(myChat.messages);
  return res.status(200).json({ messages: myChat.messages, userName: req.session.passport.user});
});

module.exports = router;