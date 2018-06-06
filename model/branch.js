const debug = require("debug")("mongo:model-branch");
const mongo = require("mongoose");
module.exports = db => {
let schema = new mongo.Schema({
    id: { type: Number, required: true, unique: true, index: true },
    name: String,
    manager: String,
    address: String,
    active: Boolean,
    created_at: Date,
    updated_at: Date
}, { autoIndex: false });

// set user not active
schema.methods.setNotActive = function () {
    // add some stuff to the users name
    this.active = false;
    return !this.active;
};

// set user active
schema.methods.setActive = function () {
    // add some stuff to the users name
    this.active = true;
    return this.active;
};

schema.statics.CREATE = async function(branch) {
    return this.create({
        id: branch[0],
        name: branch[0],
        manager: branch[0],
        address: branch[2],
        address: branch[3],
		active: true
    });
}

// on every save, add the date
schema.pre('save', function(next) {
    // get the current date
    let currentDate = new Date();
    // change the updated_at field to current date
    this.updated_at = currentDate;
    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});


schema.statics.REQUEST = async function() {
    // no arguments - bring all at once
    const args = Array.from(arguments);
    if (arguments.length === 0) {
        debug("request: no arguments - bring all at once")
        return this.find({}).exec();
    }
    // perhaps last argument is a callback for every document
    let callback = arguments[arguments.length - 1];
    if (callback instanceof Function) {
        let asynch = callback.constructor.name === 'AsyncFunction';
        args.pop();
        let cursor, user;
        try {
            cursor = await this.find(...args).cursor();
        } catch (err) { throw err; }
        try {
            while (null !== (user = await cursor.next())) {
                if (asynch) {
                    try {
                        await callback(user);
                    } catch (err) { throw err; }
                }
                else {
                    callback(user);
                }
        }
		}		catch (err) { throw err; }
        return;
    }
    // request by id as a hexadecimal string
    if (args.length === 1 && typeof args === "string") {
        debug("request: by ID");
        return this.findById(args[0]).exec();
    }
    // There is no callback - bring requested at once
    debug(`request: without callback: ${JSON.stringify(args)}`);
    return this.find(...args).exec();
}








db.model('Branch', schema); // if model name === collection name
debug("Branch model created");

}

