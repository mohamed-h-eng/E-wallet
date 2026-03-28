require("dotenv").config()
const Account = require("../models/Account")
const crypto = require('crypto');

const createController = async(req,res)=>{
    try{
        //validate user token by headers
        const {id} = req.user
        const isAccount = await Account.findOne({user_id:id}).populate("user_id")
        if(isAccount){
            return res.status(200).json({
                msg:"User Already Has Account",
                data:isAccount
            })
        }
        // generate iban
        const serial = crypto.randomBytes(10).toString('hex').toUpperCase();
        const iban = "EG00"+serial;
        await Account.create({
            user_id:id,
            iban
        })
        const createdAccount = await Account.findOne({user_id:id}).populate("user_id")
        res.status(201).json({msg:"Account Created Successfully",data:createdAccount})
    }catch(error){
        return res.status(400).json({
            message:"Account createion failed",
            data:error.message
        })
    }
}

//view account
const readController = async(req,res)=>{
    try{
        //validate user token by headers
        const {id} = req.user
        const isAccount = await Account.findOne({user_id:id}).populate("user_id")
        if(!isAccount){
            return res.status(200).json({
                msg:"User Account Not Found",
                data:isAccount
            })
        }
        const account = await Account.findOne({user_id:id}).populate("user_id")
        res.status(200).json({msg:"Account Found Successfully",data:account})
    }catch(error){
        return res.status(400).json({
            message:"Account retreive failed",
            data:error.message
        })
    }
}

module.exports = {
    createController,
    readController
}