import mongoose from "mongoose"

const itemSchema = new mongoose.Schema({
    UserId: {type:mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    itemName:  {type:String,required:true},
    discription:   {type:String,required:true},
})

const Item=mongoose.model("item", itemSchema)

export default Item