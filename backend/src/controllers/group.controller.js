import cloudinary from "../lib/cloudinary.js";
import { io,getReceiverSocketId } from "../lib/socket.js";
import Group from "../models/group.model.js";
import GroupChat from "../models/groupChat.model.js";

const createGroup = async(req,res) =>{
    try {
        const userId = req.user._id;
        const {groupName,members} = req.body;
        if(!groupName)  return res.status(400).json({'message' : 'GroupName is Required'});
        const newGroup = new Group({
            groupName,
            creator : userId,
            admins : [userId],
            members : [userId,...members]
        })
        if(newGroup){
            await newGroup.save();
            return res.status(201).json(newGroup);
        }
    } catch (error) {
        console.log("error in createGroup controller",error);
        return res.status(500).json({'message' : 'Internal Server Error'})
    }
}

const getGroupInfo = async(req,res) =>{
    try {
        const {id : groupId} = req.params;
        const group = await Group.findById(groupId);
        if(!group) return res.status(404).json({'message' : 'Group not found'})
        return res.status(200).json(group);
    } catch (error) {
        console.log("error in getGroupInfo controller",error);
        return res.status(500).json({'message' : 'Internal Server Error'})
    }
}

const getGroupsForUser = async(req,res)=>{
    try {
        const userId = req.user._id
        const groups = await Group.find({members : userId});
        //console.log(groups)
        return res.status(200).json(groups);
    } catch (error) {
        console.log("error in getGroupsForUser controller",error);
        return res.status(500).json({'message' : 'Internal Server Error'})
    }
}

const getGroupMessages = async(req,res)=>{
    const{id : groupId} = req.params;
    try {
        const messages = await GroupChat.find({groupId});
        return res.status(200).json(messages)
    } catch (error) {
        console.log("error in getGroupMessages controller",error);
        return res.status(500).json({'message' : 'Internal Server Error'})
    }
}

const sendGroupMessage = async(req,res)=>{
    try {
        const {text , image} =req.body;
        const {id : groupId} = req.params;
        const senderId = req.user._id;

        const group = await Group.findById(groupId);

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newGroupMessage = new GroupChat({
            senderId,
            groupId,
            text,
            image : imageUrl
        });
        await newGroupMessage.save();

        const members = group.members;
        members.forEach(async(member)=>{
            if(member === senderId) return;
            const receiverSocketId = getReceiverSocketId(member);
            //console.log(receiverSocketId)
            if(receiverSocketId){
                io.to(receiverSocketId).emit("newGroupMessage",newGroupMessage);
            }
        })
        return res.status(201).json(newGroupMessage);
    } catch (error) {
        console.log("error in sendGroupMessages controller",error);
        return res.status(500).json({'message' : 'Internal Server Error'})
    }
}

export {createGroup,getGroupInfo,getGroupsForUser,getGroupMessages,sendGroupMessage}