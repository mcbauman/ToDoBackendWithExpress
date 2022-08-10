import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:   {type:String,required:true, unique:true},
    email:  {type:String,required:true, unique:true},
    password:   String,
})

const User=mongoose.model("user", userSchema)

export default User