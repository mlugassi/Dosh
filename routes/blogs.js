const express = require('express');
const router = express.Router();
const Blog = require('../model')("Blog");
const User = require('../model')("User");
var multer = require('multer');
const path = require('path');
const checksession = require('./checksession');

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/images/blogs',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
// Init Upload
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('uploadedImg');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

router.get('/', checksession, function (req, res) {
    res.sendfile('./views/dist/views/index.html');
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
            imgPath: result.imgPath,
            isBlogger: result.isBlogger,
            isAdmin: result.isAdmin
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

router.post('/delete', checksession, function (req, res) {
    Blog.findOneAndUpdate({
        id: req.body.id,
        isActive: true
    }, {
            isActive: false
        }, function (err, result) {
            if (err) throw err;
            if (result == null || result.author != req.session.passport.user) return res.json({
                status: false
            });
            else return res.json({
                status: true
            });
        });
});
router.post('/add', checksession, function (req, res) {
    Blog.find({
        isActive: true
    }).sort({
        "id": -1
    }).limit(1).exec(
        function (err, result) {
            if (err) throw err;
            if (result == null || !result.isBlogger) return res.json({
                status: false
            });
            let id = result[0].id + 1;
            console.log(req.body.title);
            console.log(req.body.content);
            Blog.create({
                id: id,
                title: req.body.title,
                author: req.session.passport.user,
                content: req.body.content,
                imgPath: "\\images\\blogs\\" + id + ".jpg",
                category: "",
                likes: {
                    count: 0,
                    users: []
                },
                unlikes: {
                    count: 0,
                    users: []
                },
                comments: {
                    count: 0,
                    comment: []
                },
                isActive: true

            }, function (err, blog) {
                if (err) throw err;
                console.log('blog created:' + blog);
                return res.json({
                    status: true,
                    id: id
                });
            });
        }
    );

});
router.post('/upload', checksession, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);

        } else {
            if (req.file == undefined) {
                console.log("Error: No File Selected!");
            } else {
                console.log("File Uploded");
                let id = req.file.filename.substr(0, req.file.filename.length - 4);
                console.log(id);

                Blog.findOneAndUpdate({
                    id: id
                }, {
                        imgPath: "/images/blogs/" + req.file.filename
                    }, function (err, result) {
                        if (err) throw err;
                        if (result == null || result.author != req.session.passport.user) return res.status(200).json({
                            status: false,
                        });
                        else return res.status(200).json({
                            status: true,
                        });
                    })
            }
        }
    });
});
router.post('/update', checksession, function (req, res) {
    if (req.body.title.length < 1 || req.body.title.length > 60 || req.body.title.replace(/\s/g, '') == "") return res.json({
        status: false
    });
    else if (req.body.content.length < 100 || req.body.content.replace(/\s/g, '') == "") return res.json({
        status: false
    })
    Blog.findOneAndUpdate({
        id: req.body.id
    }, {
            title: req.body.title,
            content: req.body.content
        }, function (err, result) {
            if (err) throw err;
            if (result == null || result.author != req.session.passport.user) return res.json({
                status: false
            });
            return res.json({
                status: true
            });
        });
});

router.post('/add_comment', checksession, function (req, res) {
    let _id = "";
    Blog.findOne({
        id: req.body.blogId
    }, function (err, result) {
        if (err) throw err;
        if (result == null) return res.json({
            status: false
        });
        result.comments.count++;
        result.comments.comment.push({
            writer: req.session.passport.user,
            imgPath: req.body.imgPath,
            content: req.body.content,
            created_at: req.body.date,
            likes: {
                count: 0,
                users: []
            },
            unlikes: {
                count: 0,
                users: []
            },
            replies: []
        });
        _id = result.comments.comment[result.comments.comment.length - 1]._id;
        Blog.findOneAndUpdate({
            id: req.body.blogId
        }, result, function (err, result) {
            if (err) throw err;
            if (result == null) return res.json({
                status: false
            });
            res.json({
                status: true,
                _id: _id
            });
        });
    });

});
router.post('/add_reply', checksession, function (req, res) {
    let _id = "";
    Blog.findOne({
        id: req.body.blogId
    }, function (err, result) {
        if (err) throw err;
        if (result == null) return res.json({
            status: false
        });
        result.comments.comment.forEach(comment => {
            if (comment._id == req.body.commentId) {
                result.comments.count++;
                comment.replies.push({
                    writer: req.session.passport.user,
                    imgPath: req.body.imgPath,
                    content: req.body.content,
                    created_at: req.body.date,
                    likes: {
                        count: 0,
                        users: []
                    },
                    unlikes: {
                        count: 0,
                        users: []
                    },
                });
                _id = comment.replies[comment.replies.length - 1]._id;
            }
        }

        );
        Blog.findOneAndUpdate({
            id: req.body.blogId
        }, result, function (err, result) {
            if (err) throw err;
            if (result == null) return res.json({
                status: false
            });
            res.json({
                status: true,
                _id: _id
            });
        });
    });

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