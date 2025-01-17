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

        const sender = await User.findById(senderId)
        const receiver = await User.findById(receiverId)
        if (sender.blockedUsers.includes(receiverId) || receiver.blockedUsers.includes(senderId)) {
            if(sender.blockedUsers.includes(receiverId))
            return res.status(403).json({ message: 'Unblock user to send Messages' });
            else
            return res.status(403).json({ message: 'Message blocked by the recipient' });
        }

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
           // console.log("sending msg through socket")
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        return res.status(201).json(newMessage);
    } catch (error) {
        console.log('sendMessages error: '+error)
        return res.status(500).json({'message' : 'Internal Server Error'})
    }
}

const broadcastMessage = async(req,res)=>{
    try {
        const {text,image} = req.body;
        const senderId = req.user._id;
        const users = await User.find({ _id: { $ne: senderId } });
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        
        users.forEach(async(user)=>{
            if(!user.blockedUsers?.includes(senderId)){
            const receiverSocketId = getReceiverSocketId(user._id);
            const newMessage =new Message({
                senderId,
                receiverId: user._id,
                text,
                image : imageUrl
            })
            await newMessage.save();
            if(receiverSocketId){
                io.to(receiverSocketId).emit("newMessage",newMessage);
            }
           }
        })
        
        //help to find broadcast message by user => receiver and sender id is same

        const broadMessage =new Message({
            senderId,
            receiverId : senderId,
            text,
            image : imageUrl
        })
 
        await broadMessage.save();

        return res.status(201).json(broadMessage);
    } catch (error) {
        console.log('broadcastMessages error: '+error)
        return res.status(500).json({'message' : 'Internal Server Error'})
    }
}

const getBroadcastMessages = async(req,res)=>{
    try {
        const userId = req.user._id

        const broadMessages = await Message.find({ 
                senderId : userId , 
                receiverId : userId
         });
         res.status(200).json(broadMessages);
    } catch (error) {
        console.log('getBroadcastMessages error: '+error)
        return res.status(500).json({'message' : 'Internal Server Error'})
    }
}

export {getUsersForSidebar,getMessages,sendMessages,broadcastMessage,getBroadcastMessages};