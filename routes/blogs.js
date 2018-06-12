const express = require('express');
const router = express.Router();
const Blog = require('../model')("Blog");
const checksession = require('./checksession');


router.get('/', checksession, function (req, res) {
    res.sendfile('./views/dist/views/index.html');
});

router.get('/blogs', checksession, function (req, res) {
    Blog.find({
        isActive: true
    }, )
    Blog.find({
        isActive: true
    }, function (err, result) {
        if (err) throw err;
        if (result == null) return res.json();
        res.json(result);
    });
});

module.exports = router;