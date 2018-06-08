const express = require('express');
const router = express.Router();
const User = require('../model')("User");
const checksession = require('./checksession');


router.get('/', function (req, res) { // TODO: add check session
    let name = 'michael'; //req.session.passport.user;
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

router.post('/user', function (req, res) { // TODO: add check session
    let name = req.body.userName; //req.session.passport.user;
    if (name == undefined || name == "") throw err; // maybe check session do it
    User.findOne({
        userName: name,
        isActive: true
    }, function (err, result) {
        if (err) throw err;
        if (result == null || result == undefined) return res.status(404);
        var user = {};
        user.firstName = result.firstName;
        user.lastName = result.lastName;
        user.userName = result.userName;
        // user.birthDay = result.birthDay
        user.email = result.email;
        // user.imgPath = result.imgPath;
        user.gender = result.gender;
        // user.bloges = result.bloges; // not relevant currently
        // user.inbox = result.inbox;
        user.isAdmin = result.isAdmin;
        user.isBlogger = result.isBlogger;
        user.isActive = result.isActive;
        res.json(user);
    });
});

router.post('/delete', function (req, res) { // TODO: add check session
    let name = req.body.userName;
    if (name == undefined || name == "") throw err; // maybe check session do it
    User.findOneAndUpdate({
        userName: name
    }, {
        isActive: false
    }, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.status(200).json('{"status":"OK" }');
    })
});

router.post('/update', function (req, res) { // TODO: add check session
    //  uname = req.session.passport.user;
    console.log("in update");

    let user = {};
    if (req.body == undefined || !checkUserValues(req.body)) return res.status(200).json('{"status":"Fail" }');
    console.log("in updating");

    user.userName = req.body.userName;
    if (req.body.password != "") user.password = req.body.password;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.userName = req.body.userName;
    user.email = req.body.email;
    user.gender = req.body.gender;
    user.isActive = req.body.isActive;
    user.isBlogger = req.body.isBlogger;
    console.log("in updating finsh");
    console.log(user.userName);

    User.findOneAndUpdate({
        userName: user.userName,
        isActive: true
    }, user, function (err, result) {
        console.log("in find & update");

        if (err) throw err;
        console.log("in not error");

        // if (!result) return res.status(200).json('{"status":"Fail" }');
        res.status(200).json('{"status":"OK" }');

    });
    console.log("in EOF");

});

function checkUserValues(user) {
    if (user.userName == "" || user.firstName == "" || user.lastName == "" || user.gender == "" || user.email == "") // TODO: update the validation and check better the mail
        return false;
    console.log("in checkUserValues");
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