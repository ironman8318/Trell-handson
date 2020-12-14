const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appPackageSchema = new Schema({
    name : {
        type : String,
    }
})

module.exports= mongoose.model('appPkg' , appPackageSchema);