const express = require('express');
const router = express.Router();
const Blog = require('../model')("Blog");
const User = require('../model')("User");
var multer = require('multer');
const path = require('path');
const checksession = require('./checksession');
const {
    ObjectId
} = require('mongodb');

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
    const filetypes = /jpeg|jpg|/;
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
        if (result == null) return res.json({
            status: false,
            message: "User does't exits"
        });
        else
            res.status(200).json({
                status: true,
                message: "User exits",
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
        if (result == null || result.length == 0) return res.json({
            status: false,
            message: "There are no posts"
        });
        else
            res.json(result);
    });
});

router.get('/my_blogs', checksession, function (req, res) {
    Blog.find({
        author: req.session.passport.user,
        isActive: true
    }, function (err, result) {
        if (err) throw err;
        if (result == null || result.length == 0) return res.json({
            status: false,
            message: "There are no posts that belongs to you"
        });
        else
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
        if (result == null || result.length == 0) return res.json({
            status: false,
            message: "There are no posts that doesn't belong to you"
        });
        else
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
                if (result == null || result.length == 0) return res.json({
                    status: false,
                    message: "There are no posts"
                });
                else
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
                if (result == null || result.length == 0) return res.json({
                    status: false,
                    message: "There are no posts"
                });
                else
                    res.json(result);
            }
        );
    })()
});

router.get('/most_commented_blogs', checksession, function (req, res) {
    (async () => {
        Blog.find({
            isActive: true
        }).sort({
            "comments.count": -1
        }).limit(5).exec(
            function (err, result) {
                if (err) throw err;
                if (result == null || result.length == 0) return res.json({
                    status: false,
                    message: "There are no posts"
                });
                else
                    res.json(result);
            }
        );
    })()
});

router.get('/category/:catgory', checksession, function (req, res) {
    if (!req || !req.params || !req.params.catgory || req.params.catgory == "")
        return res.json({
            status: false,
            message: "Somthing went worng with your sent parameters"
        });
    else
        Blog.find({
            author: {
                category: req.params.catgory,
                isActive: true
            },
            isActive: true
        }, function (err, result) {
            if (err) throw err;
            if (result == null || result.length == 0) return res.json({
                status: false,
                message: "There are no posts in " + req.params.catgory + " category"
            });
            else
                res.json(result);
        });
});

router.post('/blog', checksession, function (req, res) {
    if (!req || !req.body || !req.body.id)
        return res.json({
            status: false,
            message: "Somthing went worng with your sent parameters"
        });
    else
        Blog.findOne({
            id: req.body.id,
            isActive: true
        }, function (err, result) {
            if (err) throw err;
            if (result == null) return res.json({
                status: false,
                message: "Post doesn't exists"
            });
            else
                res.json(result);
        });
});

router.post('/delete', checksession, function (req, res) {
    if (!req || !req.body || !req.body.id)
        return res.json({
            status: false,
            message: "Somthing went worng with your sent parameters"
        });
    else
        User.findOne({
            userName: req.session.passport.user,
            $or: [{
                isBlogger: true
            }, {
                price: true
            }],
            isActive: true
        }, function (err, user) {
            if (err) throw err;
            if (user == null) return res.json({
                status: false,
                message: "You do not have permission to delete this post"
            });
            else
                Blog.findOneAndUpdate({
                    id: req.body.id,
                    isActive: true
                }, {
                    isActive: false
                }, function (err, blog) {
                    if (err) throw err;
                    if (blog == null) return res.json({
                        status: false,
                        message: "Post doesn't exists"
                    });
                    else {
                        User.update({
                            userName: blog.author,
                            isBlogger: true,
                            isActive: true
                        }, {
                            blogs: user.blogs - 1
                        }, function (err, usr) {
                            if (err || !usr) throw err;
                            return res.json({
                                status: true,
                                message: "Post id: " + blog.id + " deleted successfully "
                            });
                        });
                    }
                });
        });
});

router.post('/upload', checksession, (req, res) => {
    upload(req, res, (err) => {
        if (err) throw err;
        if (!req.file)
            return res.json({
                status: false,
                message: "Not file selected"
            });
        else {
            let id = req.file.filename.substr(0, req.file.filename.length - 18);
            Blog.findOneAndUpdate({
                id: id,
                author: req.session.passport.user
            }, {
                imgPath: "/images/blogs/" + req.file.filename
            }, function (err, result) {
                if (err) throw err;
                if (result == null) return res.status(200).json({
                    status: false,
                    message: "You do not have permission to update this post"
                });
                else return res.status(200).json({
                    status: true,
                    message: "File uploded successfully"
                });
            });
            console.log("File uploded successfully");
        }
    });
});

router.post('/add', checksession, function (req, res) {
    if (!req || !req.body || !req.body.title || !req.body.content || !req.body.category || req.body.category == "") return res.json({
        status: false,
        message: "Somthing went worng with your sent parameters"
    });
    else if (req.body.title.length < 1 || req.body.title.length > 60 || req.body.title.replace(/\s/g, '') == "") return res.json({
        status: false,
        message: "Title doesn't match the length rules"
    });
    else if (req.body.content.length < 100 || req.body.content.replace(/\s/g, '') == "") return res.json({
        status: false,
        message: "Content doesn't match the length rules"
    });
    else
        User.findOne({
            userName: req.session.passport.user,
            isBlogger: true,
            isActive: true
        }, function (err, user) {
            if (err) throw err;
            if (user == null) return res.json({
                status: false,
                message: "You do not have permission to post"
            });
            else
                Blog.find({ //TODO: check if possible to change to findOne
                }).sort({
                    "id": -1
                }).limit(1).exec(
                    function (err, result) {
                        let id = 0;
                        if (err) throw err;
                        if (result == null || !result[0])
                            id = 1;
                        else
                            id = result[0].id + 1;
                        Blog.create({
                            id: id,
                            title: req.body.title,
                            author: req.session.passport.user,
                            content: req.body.content,
                            category: req.body.category,
                            imgPath: "\\images\\blogs\\" + id + +"_" + Date.now().toString() + ".jpg", // TODO: check if it save the same as refael saves
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
                            if (err || !blog) throw err;
                            User.findOneAndUpdate({
                                userName: req.session.passport.user,
                                isBlogger: true,
                                isActive: true
                            }, {
                                blogs: user.blogs + 1
                            }, function (err, usr) {
                                if (err || !usr) throw err;
                                console.log('blog created:' + blog);
                                return res.json({
                                    status: true,
                                    id: id,
                                    message: "Blog id: " + id + "created successfully"
                                });
                            });
                        });
                    }
                );
        });
});

router.post('/update', checksession, function (req, res) {
    if (!req || !req.body || !req.body.id || !req.body.title || !req.body.content || !req.body.category || req.body.category == "") return res.json({
        status: false,
        message: "Somthing went worng with your sent parameters"
    });
    else if (req.body.title.length < 1 || req.body.title.length > 60 || req.body.title.replace(/\s/g, '') == "") return res.json({
        status: false,
        message: "Title doesn't match the length rules"
    });
    else if (req.body.content.length < 100 || req.body.content.replace(/\s/g, '') == "") return res.json({
        status: false,
        message: "Content doesn't match the length rules"
    });
    else
        Blog.findOneAndUpdate({
            id: req.body.id,
            author: req.session.passport.user,
            isActive: true
        }, {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
        }, function (err, result) {
            if (err) throw err;
            if (result == null) return res.json({
                status: false,
                message: "You do not have permission to update this post"
            });
            return res.json({
                status: true,
                message: "Post updated successfully"
            });
        });
});

router.post('/add_comment', checksession, function (req, res) {
    if (!req || !req.body || !req.body.blogId || !req.body.content || !req.body.imgPath || req.body.imgPath == "" || !req.body.date || req.body.date == "") return res.json({
        status: false,
        message: "Somthing went worng with your sent parameters"
    });
    else if (req.body.content.replace(/\s/g, '') == "") return res.json({
        status: false,
        message: "Content doesn't match the length rules"
    });
    else {
        let _id = "";
        Blog.findOne({
            id: req.body.blogId,
            isActive: true
        }, function (err, result) {
            if (err) throw err;
            if (result == null) return res.json({
                status: false,
                message: "Post doesn't exists"
            });
            else {
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
                        status: false,
                        message: "Somthing went wrong with the update DB"
                    });
                    else
                        res.json({
                            status: true,
                            message: "Comment added successfully",
                            _id: _id
                        });
                });
            }
        });
    }
    // Blog.update({
    //     id: req.body.blogId,
    //     isActive: true
    // }, {
    //     $push: {
    //         "comments.comment": {
    //             writer: req.session.passport.user,
    //             imgPath: req.body.imgPath,
    //             content: req.body.content,
    //             created_at: req.body.date, // TODO: check if is needed
    //             likes: {
    //                 count: 0,
    //                 users: []
    //             },
    //             unlikes: {
    //                 count: 0,
    //                 users: []
    //             },
    //             replies: []
    //         }
    //     },
    //     $inc: {
    //         "comments.count": 1
    //     }
    // }, function (err, result) {
    //     if (err) throw err;
    //     if (result == null) return res.json({
    //         status: false,
    //         message: "Post doesn't exists"
    //     });
    //     else return res.json({
    //         status: true,
    //         message: "Comment added successfully"
    //     });
    // });
});

router.post('/add_reply', checksession, function (req, res) {
    if (!req || !req.body || !req.body.blogId || !req.body.commentId || !req.body.content || !req.body.imgPath || req.body.imgPath == "" || !req.body.date || req.body.date == "") return res.json({
        status: false,
        message: "Somthing went worng with your sent parameters"
    });
    else if (req.body.content.replace(/\s/g, '') == "") return res.json({
        status: false,
        message: "Content doesn't match the length rules"
    });
    else {
        let _id = "";
        Blog.findOne({
            id: req.body.blogId
        }, function (err, result) {
            if (err) throw err;
            if (result == null) return res.json({
                status: false,
                message: "Post doesn't exists"
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
                    status: false,
                    message: "Somthing went wrong with the update DB"
                });
                else
                    res.json({
                        status: true,
                        message: "Reply added successfully",
                        _id: _id
                    });
            });
        });


    }
    // Blog.update({
    //     id: req.body.blogId
    // }, {
    //     $push: {
    //         "comments.comment.$[cmt].replies": {
    //             writer: req.session.passport.user,
    //             imgPath: req.body.imgPath,
    //             content: req.body.content,
    //             created_at: req.body.date, // TODO: check if is needed
    //             likes: {
    //                 count: 0,
    //                 users: []
    //             },
    //             unlikes: {
    //                 count: 0,
    //                 users: []
    //             }
    //         }
    //     },
    //     $inc: {
    //         "comments.count": 1
    //     }
    // }, {
    //     arrayFilters: [{
    //         "cmt._id": {
    //             $eq: ObjectId(req.body.commentId)
    //         }
    //     }]
    // }, function (err, result) {
    //     console.log(result);
    //     if (err) throw err;
    //     if (result == null) return res.json({
    //         status: false,
    //         message: "Post or comment doesn't exists"
    //     });
    //     else return res.json({
    //         status: true,
    //         message: "Reply added successfully"
    //     });
    // });
});

router.post('/do_like', checksession, function (req, res) {
    if (!req || !req.body) result = {
        status: false,
        message: "Somthing went worng with your sent parameters"
    };
    else if (req.body.commentId && req.body.replyId && req.body.blogId)
        result = do_like_to_reply(req.body.blogId, req.body.commentId, req.body.replyId, req.session.passport.user);
    else if (req.body.commentId && req.body.blogId)
        result = do_like_to_comment(req.body.blogId, req.body.commentId, req.session.passport.user);
    else if (req.body.blogId)
        result = do_like_to_blog(req.body.blogId, req.session.passport.user);
    else result = {
        status: false,
        message: "Somthing went worng with your sent parameters"
    };
    res.status(200).json(result);
});

router.post('/do_unlike', checksession, function (req, res) {
    if (!req || !req.body) result = {
        status: false,
        message: "Somthing went worng with your sent parameters"
    };
    else if (req.body.commentId && req.body.replyId && req.body.blogId)
        result = do_unlike_to_reply(req.body.blogId, req.body.commentId, req.body.replyId, req.session.passport.user);
    else if (req.body.commentId && req.body.blogId)
        result = do_unlike_to_comment(req.body.blogId, req.body.commentId, req.session.passport.user);
    else if (req.body.blogId)
        result = do_unlike_to_blog(req.body.blogId, req.session.passport.user);
    else result = {
        status: false,
        message: "Somthing went worng with your sent parameters"
    };
    res.status(200).json(result);
});

router.post('/undo_like', checksession, function (req, res) {
    if (!req || !req.body) result = {
        status: false,
        message: "Somthing went worng with your sent parameters"
    };
    else if (req.body.commentId && req.body.replyId && req.body.blogId)
        result = undo_like_to_reply(req.body.blogId, req.body.commentId, req.body.replyId, req.session.passport.user);
    else if (req.body.commentId && req.body.blogId)
        result = undo_like_to_comment(req.body.blogId, req.body.commentId, req.session.passport.user);
    else if (req.body.blogId)
        result = undo_like_to_blog(req.body.blogId, req.session.passport.user);
    else result = {
        status: false,
        message: "Somthing went worng with your sent parameters"
    };
    res.status(200).json(result);
});

router.post('/undo_unlike', checksession, function (req, res) {
    if (!req || !req.body) result = {
        status: false,
        message: "Somthing went worng with your sent parameters"
    };
    else if (req.body.commentId && req.body.replyId && req.body.blogId)
        result = undo_unlike_to_reply(req.body.blogId, req.body.commentId, req.body.replyId, req.session.passport.user);
    else if (req.body.commentId && req.body.blogId)
        result = undo_unlike_to_comment(req.body.blogId, req.body.commentId, req.session.passport.user);
    else if (req.body.blogId)
        result = undo_unlike_to_blog(req.body.blogId, req.session.passport.user);
    else result = {
        status: false,
        message: "Somthing went worng with your sent parameters"
    };
    res.status(200).json(result);
});

router.get('/:id', checksession, function (req, res) {
    res.sendfile('./views/dist/views/index.html');
});
router.get('/filter/:filter', checksession, function (req, res) {
    res.sendfile('./views/dist/views/index.html');
});

//Blog like & unlike

function do_like_to_blog(blogId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: false,
            message: "Blog doesn't exists"
        };
        else {
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
                    status: true,
                    message: "Liked successfully"
                };
            });
        }
    });
}

function undo_like_to_blog(blogId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: false,
            message: "Blog doesn't exists"
        };
        else {
            var index = result.likes.users.indexOf(user);
            if (index > -1) {
                result.likes.users.splice(index, 1);
                result.likes.count--;
            }
            Blog.findOneAndUpdate({
                id: result.id
            }, result, function (err, result) {
                return {
                    status: true,
                    message: "Undo like successfully"
                };
            });
        }
    });
}

function do_unlike_to_blog(blogId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: false,
            message: "Blog doesn't exists"
        };
        else {
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
                    status: true,
                    message: "Unliked successfully"
                };
            });
        }
    });
}

function undo_unlike_to_blog(blogId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: false,
            message: "Blog doesn't exists"
        };
        else {
            var index = result.unlikes.users.indexOf(user);
            if (index > -1) {
                result.unlikes.users.splice(index, 1);
                result.unlikes.count--;
            }
            Blog.findOneAndUpdate({
                id: result.id
            }, result, function (err, result) {
                return {
                    status: true,
                    message: "Undo unlike successfully"
                };
            });
        }
    });
}

//Comment like & unlike

function do_like_to_comment(blogId, commentId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: false,
            message: "Comment doesn't exists"
        };
        else
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
                            status: true,
                            message: "Liked successfully"
                        };
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
            status: false,
            message: "Comment doesn't exists"
        };
        else
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
                            status: true,
                            message: "Undo like successfully"
                        };
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
            status: false,
            message: "Comment doesn't exists"
        };
        else
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
                            status: true,
                            message: "Unliked successfully"
                        };
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
            status: true,
            message: "Comment doesn't exists"
        };
        else
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
                            status: true,
                            message: "Undo unlike successfully"
                        };
                    });
                }
            });
    });
}
//Reply like & unlike

function do_like_to_reply(blogId, commentId, replyId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: false,
            message: "Reply doesn't exists"
        };
        else
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
                                    status: true,
                                    message: "Liked successfully"
                                };
                            });
                        }
                    });
                }
            });
    });
}

function undo_like_to_reply(blogId, commentId, replyId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: false,
            message: "Reply doesn't exists"
        };
        else
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
                                    status: true,
                                    message: "Undo like successfully"
                                };
                            });
                        }
                    });
                }
            });
    });
}

function do_unlike_to_reply(blogId, commentId, replyId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: false,
            message: "Reply doesn't exists"
        };
        else
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
                                    status: true,
                                    message: "Unliked successfully"
                                };
                            });
                        }
                    });
                }
            });
    });
}

function undo_unlike_to_reply(blogId, commentId, replyId, user) {
    Blog.findOne({
        id: blogId,
    }, function (err, result) {
        if (err) throw err;
        if (!result) return {
            status: false,
            message: "Reply doesn't exists"
        };
        else
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
                                    status: true,
                                    message: "Undo unlike successfully"
                                };
                            });
                        }
                    });
                }
            });
    });
}

module.exports = router;