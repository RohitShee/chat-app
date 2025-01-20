import mongoose from "mongoose";

const groupChatSchema = new mongoose.Schema({
        senderId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        groupId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Group",
            required : true
        },
        text : {
            type : String,
        },
        image : {
            type : String,
        }
},{timestamps : true})

const GroupChat  = new mongoose.model("GroupChat",groupChatSchema)
export default GroupChat