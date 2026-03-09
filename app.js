require("dotenv").config()
const express = require("express")
const mongoose= require("mongoose")
const bcrypt = require("bcrypt")
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

async function DBconnection(){
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log("db connected")
    }catch(error){
        console.log("db disconnected")
    }
}
const authRoutes = require("./routes/authRoutes")
const accountRoutes = require("./routes/accountRoutes")

app.use("/api",authRoutes)
app.use("/api",accountRoutes)


//assign admin manually
const User = require("./models/User")
async function CreateAdmin(){
    try{
        //get data
        const{ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD} = process.env
        //validate data
        if(!ADMIN_NAME|| !ADMIN_EMAIL|| !ADMIN_PASSWORD){
            return console.log("Error Creating Admin Account")
        }
        const admin = await User.findOne({email:ADMIN_EMAIL})
        // create admin account if not found
        const decodedPassword = await bcrypt.hash(ADMIN_PASSWORD,10)
        if(!admin){
            const user = await User.create({
                name:ADMIN_NAME,
                email:ADMIN_EMAIL,
                password:decodedPassword,
                role:"admin"
            })
            if(user) return console.log("Admin Account Created Successfully")
        }else{
            return console.log("Admin Already Registered")
        }
    }catch(error){
        console.log({msg:"Error Creating Admin",data:error.message})
    }
}
app.listen(PORT,(req,res)=>{
    console.log(`sever running at https://localhost:${PORT}`)
})

async function main(){
    await DBconnection()
    await CreateAdmin()
}
main()