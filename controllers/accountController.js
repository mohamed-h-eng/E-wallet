require("dotenv").config()
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const Account = require("../models/Account")

const createController = async(req,res)=>{
    try{
        //validate user token by headers
        const auth = req.headers.authorization.split(" ")[1]
        const token = jwt.verify(auth,process.env.JWT_SECRET)
        //check if there is account for user
        console.log(token)
        // if not create one
    }catch(error){
        return res.status(400).json({
            message:"Session Expired",
            data:error.message
        })
    }
}

const sendController = async(req,res)=>{
    try{

    }catch(error){
        res.status(400).json({
            message:"Transaction Failed"
        })
    }
}   
module.exports = {
    createController,
    sendController
}