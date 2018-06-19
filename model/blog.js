const debug = require("debug")("mongo:model-blog");
const mongo = require("mongoose");
module.exports = db => {
    let schema = new mongo.Schema({
        id: {
            type: Number,
            required: true,
            unique: true,
            index: true
        },
        title: String,
        subTitle: String,
        author: String,
        content: String,
        imgPath: String,
        category: String,
        likes: {
            count: Number,
            users: [String]
        },
        unlikes: {
            count: Number,
            users: [String]
        },
        comments: {
            count: Number,
            comment: [{
                writer: String,
                imgPath: String,
                content: String,
                likes: {
                    count: Number,
                    users: [String]
                },
                unlikes: {
                    count: Number,
                    users: [String]
                },
                replies: [{
                    writer: String,
                    imgPath: String,
                    content: String,
                    likes: {
                        count: Number,
                        users: [String]
                    },
                    unlikes: {
                        count: Number,
                        users: [String]
                    },
                    created_at: Date
                }],
                created_at: Date
            }]
        },
        isActive: Boolean,
        created_at: Date,
        updated_at: Date
    }, {
        autoIndex: false
    });

    // set post not active
    schema.methods.setNotActive = function () {
        this.isActive = false;
        return !this.isActive;
    };

    // set post active
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

    db.model('Blog', schema);
    debug("Blog model created");

}