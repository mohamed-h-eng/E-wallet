require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require("bcrypt")
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

async function DBconnection(){
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log("db connected")
        return true
    }catch(error){
        console.log("db disconnected")
        console.log(error.message)
        return false
    }
}
const authRoutes = require("./routes/authRoutes")
const accountRoutes = require("./routes/accountRoutes")
const transactionRoutes = require("./routes/transactionRoutes")

app.use("/api",authRoutes)
app.use("/api",accountRoutes)
app.use("/api",transactionRoutes)


//assign admin manually
const User = require("./models/User")
async function CreateAdmin(isConnected){
    try{
        if(!isConnected){
            return console.log("cancel Admin account creation: db disconnected")
        }
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

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return true
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function main(){
    const isConnected = await DBconnection()
    // const isConnected = await run()
    await CreateAdmin(isConnected)
}
main()