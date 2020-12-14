const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userPackageSchema = new Schema({
    userId : {
        type : Number,
    },
   packages : [{
       type : String,
   }
   ]
})

module.exports= mongoose.model('userPkg' , userPackageSchema);