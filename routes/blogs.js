const express = require('express');
const router = express.Router();
const Blog = require('../model')("Blog");
const checksession = require('./checksession');

router.get('/', checksession, function (req, res) {
    res.sendfile('./views/dist/views/index.html');
});

router.get('/all_blogs', checksession, function (req, res) {
    Blog.find({
        isActive: true
    }, function (err, result) {
        if (err) throw err;
        if (result == null) return res.json();
        res.json(result);
    });
});

router.get('/my_blogs', checksession, function (req, res) {
    Blog.find({
        author: req.session.passport.user,
        isActive: true
    }, function (err, result) {
        if (err) throw err;
        if (result == null) return res.json();
        res.json(result);
    });
});

router.get('/all_blogs_but_mine', checksession, function (req, res) {
    Blog.find({
        author: {
            $ne: req.session.passport.user
        },
        isActive: true
    }, function (err, result) {
        if (err) throw err;
        if (result == null) return res.json();
        res.json(result);
    });
});

router.get('/favorite_blogs', checksession, function (req, res) {
    (async () => {
        Blog.find({
            isActive: true
        }).sort({
            "likes.count": -1
        }).limit(5).exec(
            function (err, result) {
                if (err) throw err;
                if (result == null) return res.json();
                res.json(result);
            }
        );
    })()
});
router.get('/recent_posts', checksession, function (req, res) {
    (async () => {
        Blog.find({
            isActive: true
        }).sort({
            created_at: -1
        }).limit(7).exec(
            function (err, result) {
                if (err) throw err;
                if (result == null) return res.json();
                res.json(result);
            }
        );
    })()
});

router.post('/blog', checksession, function (req, res) {
    Blog.findOne({
        id: req.body.id,
        isActive: true
    }, function (err, result) {
        if (err) throw err;
        if (result == null) return res.json();
        res.json(result);
    });
});

router.get('/:id', checksession, function (req, res) {
    res.sendfile('./views/dist/views/index.html');
});
module.exports = router;