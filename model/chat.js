const debug = require("debug")("mongo:model-chat");
const mongo = require("mongoose");

module.exports = db => {
    let schema = new mongo.Schema({
        id: {
            type: Number,
            required: true,
            unique: true,
            index: true
        },
        owner: String,
        participates: [String],
        messages: [{
            text: String,
            sender: String,
            date: Date,
            likes: {
                count: Number,
                users: [String]
            },
            unlikes: {
                count: Number,
                users: [String]
            },
            // isActive: Boolean,
            created_at: Date,
            updated_at: Date
        }],
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

    db.model('Chat', schema);
    debug("Chat model created");

}
