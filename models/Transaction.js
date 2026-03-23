const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    sender_iban:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiver_iban:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    amount:{
        type:Number,
        min:5,
        required:true
    },
    type:{
        type:String,
        enum:["deposit","withdraw"],
        required:true
    },
    note:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Cancelled"],
        default:"active"
    }
},{timestamps:true})

const Transaction = mongoose.model("Transaction",transactionSchema);
module.exports = Transaction;