const express = require('express');
const router = express.Router();
const User = require('../model')("User");
const checksession = require('./checksession');
var multer = require('multer');
const path = require('path');
var crypto = require("crypto-js/aes");

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/images/users_profiles',
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
    const filetypes = /jpeg|jpg/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only jpg images!');
    }
}
router.post('/upload', checksession, (req, res) => {
    upload(req, res, (err) => {
        if (err) throw err;
        if (!req.file)
            return res.json({
                status: false,
                message: "Not file selected"
            });
        else {
            let uname = req.file.filename.substr(0, req.file.filename.length - 18);
            User.findOneAndUpdate({
                userName: uname,
                isActive: true
            }, {
                imgPath: "/images/users_profiles/" + req.file.filename
            }, function (err, result) {
                if (err) throw err;
                if (result == null) return res.status(200).json({
                    status: false,
                    message: "User doesn't exits"
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

router.get('/', checksession, function (req, res) {
    User.findOne({
        userName: req.session.passport.user,
        isAdmin: true
    }, function (err, user) {
        if (err || !user)
            return res.redirect('/');
        else
            return res.sendfile("./views/dist/views/index.html");
    })
});

router.get('/users', checksession, function (req, res) {
    User.findOne({
        userName: req.session.passport.user,
        isAdmin: true,
        isActive: true
    }, function (err, result) {
        if (err) throw err;
        if (!result)
            return res.json({
                status: false,
                message: "You don't have access"
            });
        else
            User.find({
                isActive: true
            }, function (err, users) {
                if (err) throw err;
                users.forEach(usr => {
                    usr._id = undefined;
                    usr.password = undefined;
                    usr.passwordKey = undefined;
                    usr.inbox = undefined;
                    usr.isResetReq = undefined;
                    usr.uuid = undefined;
                    usr.updated_at = undefined;
                    usr.created_at = undefined;
                    usr.__v = undefined;
                });
                return res.json(users);
            });

    });
});

router.post('/user', checksession, function (req, res) {
    if (!req || !req.body)
        return res.status(200).json({
            status: false,
            message: "Somthing went worng with your sent parameters"
        });
    let name = req.body.userName || req.session.passport.user;
    if (name == undefined || name == "") throw err;
    User.findOne({
        userName: name,
        isActive: true
    }, function (err, result) {
        if (err) throw err;
        if (result == null || result == undefined) return res.json({
            status: false,
            message: "User doesn't exits"
        });
        var user = {};
        user.firstName = result.firstName;
        user.lastName = result.lastName;
        user.userName = result.userName;
        user.birthDay = result.birthDay;
        user.email = result.email;
        user.imgPath = result.imgPath;
        user.gender = result.gender;
        user.blogs = result.blogs;
        user.isAdmin = result.isAdmin;
        user.isBlogger = result.isBlogger;
        user.isActive = result.isActive;
        user.inboxCount = result.inboxCount;
        res.json(user);
    });
});

router.post('/delete', checksession, function (req, res) {
    if (!req || !req.body || !req.body.userName || req.body.userName == "")
        return res.status(200).json({
            status: false,
            message: "Somthing went worng with your sent parameters"
        });
    User.findOneAndUpdate({
        userName: req.body.userName
    }, {
        isActive: false
    }, function (err, result) {
        if (err) throw err;
        if (!result) return res.status(200).json({
            status: false,
            message: "User doesn't exists"
        });
        else
            return res.status(200).json({
                status: true,
                message: "User deleted successfully"
            });
    })
});

router.post('/update', checksession, async (req, res) => {
    if (!req || !req.body || !req.body.user)
        return res.status(200).json({
            status: false,
            message: "Somthing went worng with sssyour sent parameters"
        });
    var userToFind = {};
    if (req.session.passport.user == req.body.user.userName) /// edit user
    {
        let myUser = await User.findOne({
            userName: req.body.user.userName,
            isActive: true
        }).exec();
        if (myUser == undefined)
            return res.status(200).json({
                status: false,
                message: "Your user name is wrong!"
            });

        if (req.body.user.password != undefined && req.body.user.password != "" &&
            req.body.oldPassword != undefined && req.body.oldPassword != "") {
            userToFind.password = crypto.decrypt(req.body.oldPassword, myUser.passwordKey);
            req.body.user.password = crypto.decrypt(req.body.user.password, myUser.passwordKey);
        } else
            delete req.body.user.password;
        if (req.body.user.isBlogger && !myUser.isBlogger) {
            let message = [{
                title: "Request for blogger",
                content: "I want to be a blogger",
                sender: req.body.user.userName,
                date: Date.now(),
                isRead: false,
                isConfirm: false
            }];
            User.update({
                    isAdmin: true,
                    isActive: true
                }, {
                    $push: {
                        inbox: message
                    }
                },
                function (err, user) {
                    if (err || !user) {
                        res.status(200).json({
                            status: true,
                            message: "Your request for blogger wasn't sent."
                        });
                    }
                });
            delete req.body.user.isBlogger;
        }
    } else { //Is an admin
        User.findOne({
            userName: req.session.passport.user,
            isActive: true,
            isAdmin: true
        }, function (err, user) {
            if (err || !user)
                return res.status(200).json({
                    status: false,
                    message: "Your not an admin!\nYou can't change othe users properties"
                });
        });
        if (req.body.user.password != undefined && req.body.user.password != "") {
            let myUser = await User.findOne({
                userName: req.body.user.userName,
                isActive: true
            }).exec();
            req.body.user.password = crypto.decrypt(req.body.user.password, myUser.passwordKey);
        } else delete req.body.user.password;
    }
    if (!checkUserValues(req.body.user))
        return res.status(200).json({
            status: false,
            message: "Somthing missed in your properties"
        });

    userToFind.userName = req.body.user.userName;
    userToFind.isActive = true;
    req.body.user.passwordKey = "";

    User.findOneAndUpdate(userToFind, req.body.user, function (err, user) {
        if (err || !user)
            return res.status(200).json({
                status: false,
                message: "Your old password isn't correct!\nPlease try again."
            });
        res.status(200).json({
            status: true,
            message: "Your changed was saved."
        });
    });
});

function checkUserValues(user) {
    if (user.userName == "" || user.firstName == "" || user.lastName == "" || user.gender == "" || user.email == "") // TODO: update the validation and check better the mail
        return false;
    return true;
}

module.exports = router;