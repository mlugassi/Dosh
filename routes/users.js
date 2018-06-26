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
router.post('/upload', checksession, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);

        } else {
            if (req.file == undefined) {
                console.log("Error: No File Selected!");
            } else {
                console.log("File Uploded");
                let uname = req.file.filename.substr(0, req.file.filename.length - 18);
                console.log(uname);

                User.findOneAndUpdate({
                    userName: uname
                }, {
                        imgPath: "/images/users_profiles/" + req.file.filename
                    }, function (err, result) {
                        if (err) throw err;
                        res.status(200).json('{"status":"OK" }');
                    })
            }
        }
    });
});

router.get('/', checksession, function (req, res) {
    res.sendfile("./views/dist/views/index.html");
});

router.get('/users', checksession, function (req, res) {
    let name = req.session.passport.user;
    if (name == undefined || name == "") throw err; // maybe check session do it
    User.findOne({
        userName: name,
        isActive: true
    }, function (err, result) {
        if (err) throw err;
        if (result != null && result.isAdmin)
            (async () => {
                var users = await User.find({
                    isActive: true
                }).exec();
                res.json(users);
            })();
    });
});

router.post('/user', checksession, function (req, res) {
    let name = req.body.userName || req.session.passport.user;
    if (name == undefined || name == "") throw err; // maybe check session do it
    User.findOne({
        userName: name,
        isActive: true
    }, function (err, result) {
        if (err) throw err;
        if (result == null || result == undefined) return res.status(404);
        //delete result[password]
        var user = {};
        user.firstName = result.firstName;
        user.lastName = result.lastName;
        user.userName = result.userName;
        user.birthDay = result.birthDay;
        user.email = result.email;
        user.imgPath = result.imgPath;
        user.gender = result.gender;
        user.bloges = result.bloges;
        //user.inbox = result.inbox;
        user.isAdmin = result.isAdmin;
        user.isBlogger = result.isBlogger;
        user.isActive = result.isActive;
        res.json(user);
    });
});

router.post('/delete', checksession, function (req, res) {
    let name = req.body.userName;
    if (name == undefined || name == "") throw err; // maybe check session do it
    User.findOneAndUpdate({
        userName: name
    }, {
            isActive: false
        }, function (err, result) {
            if (err) throw err;
            res.status(200).json('{"status":"OK" }');
        })
});

router.post('/update', checksession, async (req, res) => {
    var userToFind = {};
    if (req.session.passport.user == req.body.user.userName) /// edit user
    {
        if (req.body.user.password != undefined && req.body.user.password != ""
            && req.body.oldPassword != undefined && req.body.oldPassword != "") {
            let myUser = await User.findOne({ userName: req.body.user.userName, isActive: true }).exec();
            userToFind.password = crypto.decrypt(req.body.oldPassword, myUser.passwordKey);
            req.body.user.password = crypto.decrypt(req.body.user.password, myUser.passwordKey);
        }
        else
            delete req.body.user.password;
    }
    else {//Is an admin
        User.findOne({ userName: req.session.passport.uname, isActive: true, isAdmin: true }, function (err, user) {
            if (err || !user)
                return res.status(200).json({ status: false });
        });
        if (req.body.user.password != undefined && req.body.user.password != "") {
            let myUser = await User.findOne({ userName: req.body.user.userName, isActive: true }).exec();
            req.body.user.password = crypto.decrypt(req.body.user.password, myUser.passwordKey);
        }
        else delete req.body.user.password;
    }
    if (!checkUserValues(req.body.user))
        return res.status(200).json({ status: false });

    userToFind.userName = req.body.user.userName;
    userToFind.isActive = true;
    req.body.user.passwordKey = "";

    User.findOneAndUpdate(userToFind, req.body.user, function (err, user) {
        if (err || !user)
            return res.status(200).json({ status: false });
        res.status(200).json({ status: true });
    });
});

function checkUserValues(user) {
    if (user.userName == "" || user.firstName == "" || user.lastName == "" || user.gender == "" || user.email == "") // TODO: update the validation and check better the mail
        return false;
    return true;
}
// router.get('/Details', function (req, res) {
//     var name = req.session.passport.user;
//     User.findOne({ userName: name, active: true }, function (err, result) {
//         if (err) throw err;
//         if (result != null)
//             (async () => {
//                 var branch = await Branch.findOne({ id: result.branch });
//                 var user = {};
//                 user.firstName = result.firstName;
//                 user.lastName = result.lastName;
//                 user.userName = result.userName;
//                 user.password = result.password;
//                 user.email = result.email;
//                 user.role = result.role;
//                 if (user.role == "employee")
//                     user.branch = result.branch + " " + branch.name + ", " + branch.address;
//                 user.gender = result.gender;
//                 user.active = result.active;
//                 res.status(200).json(JSON.stringify(user));
//             })();
//     });
// });



// router.post('/update',checksession, function (req, res) {
//     uname = req.session.passport.user;
//     var user = {};
//     if (req.body.user) {
//         user.firstName = req.body.user.firstName;
//         user.lastName = req.body.user.lastName;
//         user.userName = req.body.user.userName;
//         //user.role = req.body.user.role;
//         user.gender = req.body.user.gender;
//         user.email = req.body.user.email;
//         if (req.body.user.password) {
//             user.password = req.body.user.password;
//             User.findOneAndUpdate({ userName: user.userName, password: req.body.user.oldPassword }, user, function (err, result) {
//                 if (err || !result)
//                     res.status(404).json('{"status":"FAIL" }');
//                 else
//                     res.status(200).json('{"status":"OK" }');
//             })
//         }
//         else {
//             User.findOneAndUpdate({ userName: user.userName }, user, function (err, result) {
//                 if (err) console.log(err);
//                 res.status(200).json('{"status":"OK" }');
//             })
//         }
//     }
//     else {
//         if(req.body.userName) user.userName = req.body.userName;
//         if(req.body.password) user.password = req.body.password;
//         user.firstName = req.body.firstName;
//         user.lastName = req.body.lastName;
//         user.userName = req.body.userName;
//         user.email = req.body.email;
//         user.role = req.body.role;
//         if (user.role == "employee")
//             user.branch = req.body.branch.split(" ")[0];
//         user.gender = req.body.gender;
//         user.active = req.body.active;
//         User.findOneAndUpdate({ userName: user.userName }, user, function (err, result) {
//             if (err || !result) console.log(err);
//             res.status(200).json('{"status":"OK" }');
//         })
//     }
// });

// router.post('/remove',checksession, function (req, res) {
//     name = req.body.uname;
//     User.findOneAndUpdate({ userName: name }, { active: false }, function (err, result) {
//         if (err) throw err;
//         console.log(result);
//         res.status(200).json('{"status":"OK" }');
//     })
// });

// router.post('/add',checksession, function (req, res) {
//     User.findOne({ userName: req.body.userName }, function (err, user) {
//         if (err) throw err;
//         if (user != null)
//             res.status(200).json('{"error":"User Name Alredy Exist" }');
//         else {
//             var user = {};
//             user.firstName = req.body.firstName;
//             user.lastName = req.body.lastName;
//             user.userName = req.body.userName;
//             user.password = req.body.password;
//             user.email = req.body.email;
//             user.role = req.body.role;
//             if (user.role == "employee")
//                 user.branch = req.body.branch.split(" ")[0];
//             user.gender = req.body.gender;
//             user.active = req.body.active;
//             user.reset = false;
//             user.uuid = "";
//             User.create(user, function (err, user) {
//                 if (err) throw err;
//                 res.render('partials/user_row.ejs', { user: user });
//                 console.log('user created:' + user);
//             });
//         }
//     });
// });

// router.get('/manage',checksession, function (req, res) {
//     (async () => {
//       var name = req.session.passport.user;
//       var activeBranches = await Branch.find({ active: true }).exec();
//       var role = " ";
//       if (req.session.passport.user !== undefined) {
//         role = (await User.findOne({ userName: req.session.passport.user }).select('role').exec()).role;
//       }
//       switch (role) {
//         case "manager":
//           var users = await User.find({ active: true }).exec();
//           res.render('manage_users', { role: role, users: users, branches: activeBranches });
//           break;
//         case "employee":
//           var users = await User.find({ active: true, role: 'customer' }).exec();
//           res.render('manage_users', { role: role, users: users, branches: activeBranches });
//           break;
//         default:
//           res.render('page_not_found');
//       }
//     })();

//   });

module.exports = router;