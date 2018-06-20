const express = require('express');
const router = express.Router();
const Blog = require('../model')("Blog");
const User = require('../model')("User");
const checksession = require('./checksession');

router.get('/', checksession, function (req, res) {
    res.sendfile('./views/dist/views/index.html');
});

router.post('/do_like', checksession, function (req, res) {
    if (req.body.commentId && req.body.replyId && req.body.blogId)
        result = do_like_to_reply(req.body.blogId, req.body.commentId, req.body.replyId, req.session.passport.user);
    else if (req.body.commentId && req.body.blogId)
        result = do_like_to_comment(req.body.blogId, req.body.commentId, req.session.passport.user);
    else if (req.body.blogId)
        result = do_like_to_blog(req.body.blogId, req.session.passport.user);
    else result = {
        status: "Fail"
    };
    res.status(200).json(result);
});

router.post('/do_unlike', checksession, function (req, res) {
    if (req.body.commentId && req.body.replyId && req.body.blogId)
        result = do_unlike_to_reply(req.body.blogId, req.body.commentId, req.body.replyId, req.session.passport.user);
    else if (req.body.commentId && req.body.blogId)
        result = do_unlike_to_comment(req.body.blogId, req.body.commentId, req.session.passport.user);
    else if (req.body.blogId)
        result = do_unlike_to_blog(req.body.blogId, req.session.passport.user);
    else result = {
        status: "Fail"
    };
    res.status(200).json(result);
});
router.post('/undo_like', checksession, function (req, res) {
    if (req.body.commentId && req.body.replyId && req.body.blogId)
        result = undo_like_to_reply(req.body.blogId, req.body.commentId, req.body.replyId, req.session.passport.user);
    else if (req.body.commentId && req.body.blogId)
        result = undo_like_to_comment(req.body.blogId, req.body.commentId, req.session.passport.user);
    else if (req.body.blogId)
        result = undo_like_to_blog(req.body.blogId, req.session.passport.user);
    else result = {
        status: "Fail"
    };
    res.status(200).json(result);
});

router.post('/undo_unlike', checksession, function (req, res) {
    if (req.body.commentId && req.body.replyId && req.body.blogId)
        result = undo_unlike_to_reply(req.body.blogId, req.body.commentId, req.body.replyId, req.session.passport.user);
    else if (req.body.commentId && req.body.blogId)
        result = undo_unlike_to_comment(req.body.blogId, req.body.commentId, req.session.passport.user);
    else if (req.body.blogId)
        result = undo_unlike_to_blog(req.body.blogId, req.session.passport.user);
    else result = {
        status: "Fail"
    };
    res.status(200).json(result);
});

router.get('/who_am_I', checksession, function (req, res) {
    User.findOne({
        userName: req.session.passport.user,
        isActive: true
    }, function (err, result) {
        if (err) throw err;
        if (result == null) return res.json();
        res.status(200).json({
            watcher: result.userName,
            imgPath: result.imgPath
        });
    });
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

function do_like_to_reply(blogId, commentId, replyId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: "Fail"
        };
        result.comments.comment.forEach(comment => {
            if (comment._id == commentId) {
                comment.replies.forEach(reply => {
                    if (reply._id == replyId) {
                        reply.likes.count++;
                        reply.likes.users.push(user);
                        var index = reply.unlikes.users.indexOf(user);
                        if (index > -1) {
                            reply.unlikes.users.splice(index, 1);
                            reply.unlikes.count--;
                        }
                        Blog.findOneAndUpdate({
                            id: result.id
                        }, result, function (err, result) {
                            return {
                                status: "OK"
                            };
                        });
                    }
                });
            }
        });
    });
}

function do_like_to_comment(blogId, commentId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: "Fail"
        };
        result.comments.comment.forEach(comment => {
            if (comment._id == commentId) {
                comment.likes.count++;
                comment.likes.users.push(user);
                var index = comment.unlikes.users.indexOf(user);
                if (index > -1) {
                    comment.unlikes.users.splice(index, 1);
                    comment.unlikes.count--;
                }
                Blog.findOneAndUpdate({
                    id: result.id
                }, result, function (err, result) {
                    return {
                        status: "OK"
                    };
                });
            }
        });
    });
}

function do_like_to_blog(blogId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: "Fail"
        };
        result.likes.count++;
        result.likes.users.push(user);
        var index = result.unlikes.users.indexOf(user);
        if (index > -1) {
            result.unlikes.users.splice(index, 1);
            result.unlikes.count--;
        }
        Blog.findOneAndUpdate({
            id: result.id
        }, result, function (err, result) {
            return {
                status: "OK"
            };
        });
    });
}

function do_unlike_to_reply(blogId, commentId, replyId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: "Fail"
        };
        result.comments.comment.forEach(comment => {
            if (comment._id == commentId) {
                comment.replies.forEach(reply => {
                    if (reply._id == replyId) {
                        reply.unlikes.count++;
                        reply.unlikes.users.push(user);
                        var index = reply.likes.users.indexOf(user);
                        if (index > -1) {
                            reply.likes.users.splice(index, 1);
                            reply.likes.count--;
                        }
                        Blog.findOneAndUpdate({
                            id: result.id
                        }, result, function (err, result) {
                            return {
                                status: "OK"
                            };
                        });
                    }
                });
            }
        });
    });
}

function do_unlike_to_comment(blogId, commentId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: "Fail"
        };
        result.comments.comment.forEach(comment => {
            if (comment._id == commentId) {
                comment.unlikes.count++;
                comment.unlikes.users.push(user);
                var index = comment.likes.users.indexOf(user);
                if (index > -1) {
                    comment.likes.users.splice(index, 1);
                    comment.likes.count--;
                }
                Blog.findOneAndUpdate({
                    id: result.id
                }, result, function (err, result) {
                    return {
                        status: "OK"
                    };
                });
            }
        });
    });
}

function do_unlike_to_blog(blogId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: "Fail"
        };
        result.unlikes.count++;
        result.unlikes.users.push(user);
        var index = result.likes.users.indexOf(user);
        if (index > -1) {
            result.likes.users.splice(index, 1);
            result.likes.count--;
        }
        Blog.findOneAndUpdate({
            id: result.id
        }, result, function (err, result) {
            return {
                status: "OK"
            };
        });
    });
}

function undo_like_to_reply(blogId, commentId, replyId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: "Fail"
        };
        result.comments.comment.forEach(comment => {
            if (comment._id == commentId) {
                comment.replies.forEach(reply => {
                    if (reply._id == replyId) {
                        var index = reply.likes.users.indexOf(user);
                        if (index > -1) {
                            reply.likes.users.splice(index, 1);
                            reply.likes.count--;
                        }
                        Blog.findOneAndUpdate({
                            id: result.id
                        }, result, function (err, result) {
                            return {
                                status: "OK"
                            };
                        });
                    }
                });
            }
        });
    });
}

function undo_like_to_comment(blogId, commentId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: "Fail"
        };
        result.comments.comment.forEach(comment => {
            if (comment._id == commentId) {
                var index = comment.likes.users.indexOf(user);
                if (index > -1) {
                    comment.likes.users.splice(index, 1);
                    comment.likes.count--;
                }
                Blog.findOneAndUpdate({
                    id: result.id
                }, result, function (err, result) {
                    return {
                        status: "OK"
                    };
                });
            }
        });
    });
}

function undo_like_to_blog(blogId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: "Fail"
        };
        var index = result.likes.users.indexOf(user);
        if (index > -1) {
            result.likes.users.splice(index, 1);
            result.likes.count--;
        }
        Blog.findOneAndUpdate({
            id: result.id
        }, result, function (err, result) {
            return {
                status: "OK"
            };
        });
    });
}

function undo_unlike_to_reply(blogId, commentId, replyId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: "Fail"
        };
        result.comments.comment.forEach(comment => {
            if (comment._id == commentId) {
                comment.replies.forEach(reply => {
                    if (reply._id == replyId) {
                        var index = reply.unlikes.users.indexOf(user);
                        if (index > -1) {
                            reply.unlikes.users.splice(index, 1);
                            reply.unlikes.count--;
                        }
                        Blog.findOneAndUpdate({
                            id: result.id
                        }, result, function (err, result) {
                            return {
                                status: "OK"
                            };
                        });
                    }
                });
            }
        });
    });
}

function undo_unlike_to_comment(blogId, commentId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: "Fail"
        };
        result.comments.comment.forEach(comment => {
            if (comment._id == commentId) {
                var index = comment.unlikes.users.indexOf(user);
                if (index > -1) {
                    comment.unlikes.users.splice(index, 1);
                    comment.unlikes.count--;
                }
                Blog.findOneAndUpdate({
                    id: result.id
                }, result, function (err, result) {
                    return {
                        status: "OK"
                    };
                });
            }
        });
    });
}

function undo_unlike_to_blog(blogId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: "Fail"
        };
        var index = result.unlikes.users.indexOf(user);
        if (index > -1) {
            result.unlikes.users.splice(index, 1);
            result.unlikes.count--;
        }
        Blog.findOneAndUpdate({
            id: result.id
        }, result, function (err, result) {
            return {
                status: "OK"
            };
        });
    });
}
module.exports = router;