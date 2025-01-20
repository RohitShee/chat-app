import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    groupName :{
        type : String,
        required : true
    },
    groupPic :{
        type: String,
        default: ""
    },
    creator :{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true,
    },
    admins :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    members :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ]

},{timestamps : true})

const Group = mongoose.model("Group",groupSchema)

export default Group;


