const debug = require("debug")("mongo:model");
const mongo = require("mongoose");
let db = mongo.createConnection();
(async () => {
    try {
        await db.openUri('mongodb://localhost/Dosh');
    } catch (err) {
        console.log("Error connecting to DB: " + err);
    }
})();
require("./user")(db);
//require("./todo")(db);
module.exports = model => db.model(model);