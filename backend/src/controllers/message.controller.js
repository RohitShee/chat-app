import cloudinary from "../lib/cloudinary.js";
import { io,getReceiverSocketId } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

const getUsersForSidebar = async(req,res) =>{
   try {
     const loggedInUser = req.user._id;
     const filteredUser = await User.find({_id : {$ne :loggedInUser}}).select('-password');
     res.status(200).json(filteredUser);
   } catch (error) {
    console.log('getUserForSidebar error: '+error)
    return res.status(500).json({'message' : 'Internal Server Error'})
  }
}

const getMessages = async(req,res) =>{
    try {
        const {id : userToChatId} = req.params;
        const myId  = req.user._id;
        const messages = await Message.find({ 
            $or : [
                {senderId : myId , receiverId : userToChatId},
                {senderId : userToChatId , receiverId : myId}
            ]
         })
         res.status(200).json(messages);
    } catch (error) {
        console.log('getMessages Controller error: '+error)
        return res.status(500).json({'message' : 'Internal Server Error'})
    }
}

const sendMessages = async(req,res) =>{
    try {
        const {text , image} =req.body;
        const {id : receiverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image : imageUrl
        })
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        return res.status(201).json(newMessage);
    } catch (error) {
        console.log('sendMessages error: '+error)
        return res.status(500).json({'message' : 'Internal Server Error'})
    }
}

export {getUsersForSidebar,getMessages,sendMessages};