import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import User from "./UserModel.js"
import Items from "./ItemModel.js"

function connect(){
    const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
    const connectionString = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;
  
    mongoose.connection.on("connecting", () => console.log("[DB] connecting"));
    mongoose.connection.on("connected", () => console.log("[DB] connected"));
    mongoose.connection.on("disconnecting", () =>console.log("[DB] disconnecting"));
    mongoose.connection.on("disconnected", () =>console.log("[DB] disconnected"));
    mongoose.connection.on("reconnected", () => console.log("[DB] reconnected"));
    mongoose.connection.on("error", (er) => console.log("[DB] error", er));
  
    mongoose.connect(connectionString);
}

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connect();
//USE REQ:PARAMS/Req.xxx
app.post("/login", async(req,res,next)=>{
    try {
        const user=await User.findOne({name:req.body.name})
        if(!user){return next({status:405,message:"user doesnt exist"})}
        if(req.body.password != user.password)
        {res.send("password missmatch")}
        res.send(user._id)
    } catch (error) {
        next({status:400,message:error})
    }
})

//Post Create New User
app.post("/user/create", async(req,res,next)=>{
    const user = await User.create({...req.body})
    const user2 = await User.findOne({name:req.body.name})
    res.send(user2._id)
})

//Get Items
app.get("/item", async(req,res,next)=>{
    const items=await Items.find({UserId:req.query.id})
    res.send(items)
})

//Post Items
app.post("/item", async(req,res, next)=>{
    console.log(req.body);
    await Items.create({...req.body})
    res.send("item stored")
})

// Global Error Handler:
app.use((error, req, res, next)=>{
    console.log("GlobalError",error);
    res.status(error.status || 500).send({
        error: error.message || error.errors ||"Something went wrong"
    })
})

app.listen(process.env.PORT,()=>console.log("Server listening to"+process.env.PORT))