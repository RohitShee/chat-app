import Group from "../models/group.model.js";

const createGroup = async(req,res) =>{
    try {
        const userId = req.user._id;
        const {groupName,members} = req.body;
        console.log(members);
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
        const groups = Group.find({members : userId});
        return res.status(200).json(groups);
    } catch (error) {
        console.log("error in getGroupsForUser controller",error);
        return res.status(500).json({'message' : 'Internal Server Error'})
    }
}

export {createGroup,getGroupInfo,getGroupsForUser}