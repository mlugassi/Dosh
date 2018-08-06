const debug = require("debug")("mongo:model-user");
const mongo = require("mongoose");

module.exports = db => {
    let schema = new mongo.Schema({
        firstName: String,
        lastName: String,
        userName: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        password: {
            type: String,
            required: true
        },
        email: { type: String, unique: true },
        uuid: { type: String, unique: true },
        phoneUuid: { type: String, unique: true },
        gender: String,
        imgPath: String,
        birthDay: Date,
        phone: {
            type: String,
            unique: true
        },
        blogs: Number,
        inboxCount: Number,
        inbox: [{
            title: String,
            kind: String,
            content: String,
            sender: String,
            date: Date,
            isRead: Boolean,
            isConfirm: Boolean,
        }],
        isAdmin: Boolean,
        isBlogger: Boolean,
        isActive: Boolean,
        isResetReq: Boolean,
        passwordKey: { type: String, unique: true },
        created_at: Date,
        updated_at: Date
    }, {
            autoIndex: false
        });

    // set user not active
    schema.methods.setNotActive = function () {
        this.isActive = false;
        return !this.isActive;
    };

    // set user active
    schema.methods.setActive = function () {
        this.isActive = true;
        return this.isActive;
    };

    // on every save, add the date
    schema.pre('save', function (next) {
        // get the current date
        let currentDate = new Date();
        // change the updated_at field to current date
        this.updated_at = currentDate;
        // if created_at doesn't exist, add to that field
        if (!this.created_at)
            this.created_at = currentDate;
        next();
    });

    db.model('User', schema);
    debug("User model created");

}
