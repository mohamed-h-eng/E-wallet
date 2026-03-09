require("dotenv").config
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const registerController = async (req,res)=>{
    try{
        // check if user not found
        const{name, email,password} = req.body;
        let user = await User.findOne({email})
        if(user) {
            return res.status(201).json({
                message:"User already Registered",
                data:user
            })
        }
        // create user with hashed password
        const decodedPassword = await bcrypt.hash(password,10)
        user = await User.create({name, email,password:decodedPassword})
        if(user) return res.status(200).json({
            message:"User Registered Successfully",
            data:user
        })
    }catch(error){
        res.status(400).json({
            msg:"Error Registering User",data:error.message
        })
    }
}

const loginController = async (req,res)=>{
    try{
        //check if user not found
        const{email,password} = req.body;
        let user = await User.findOne({email})
        if(!user) {
            return res.status(201).json({
                message:"User Is Not Registered",
                data:""
            })
        }
        //login user
        user = await bcrypt.compare(password,user.password)
        if(!user){
            return res.status(400).json({message:"Incorrect password"})
        }
        const token = jwt.sign(
            {
                id:user._id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1d"
            }
        )
        res.status(200).json({
            message:"Loged In Successfully",
            data:token
        })
    }catch(error){
        res.status(400).json({
            message:"Invalid Login"
        })
    }
}

//send money
const sendController = async (req,res)=>{
    try{
        //validate user
        
        // // const{name, email} = req.body;
        // let user = await User.findOne({email})
        // if(!user) {
        //     return res.status(201).json({
        //         message:"User Is Not Registered",
        //         data:""
        //     })
        // }
        
        //validate receiver

        //validate not self transfer
        // check daily/transaction limit
        // check transaction amount limit
        // check suffecient balance
    }catch(error){
        res.status(400).json({
            message:"Sending Failed"
        })
    }
}
//view transactions

//view account
module.exports = {
    registerController,
    loginController,
    sendController
}