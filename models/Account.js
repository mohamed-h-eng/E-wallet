const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    iban:Number,
    balance:{
        type:Number,
        min:0
    },
    status:{
        type:String,
        enum:["active","frozen","closed"],
        default:"active"
    }
},{timestamps:true})

const Account = mongoose.model("Account",accountSchema);
module.exports = Account;