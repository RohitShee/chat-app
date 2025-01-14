import User from "../models/user.model.js";

 const blockUser = async(req,res) =>{
  try {
    const {blockUserId} = req.body
    //console.log(blockUserId)
    const userId = req.user._id
    const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.blockedUsers.includes(blockUserId)) {
            user.blockedUsers.push(blockUserId);
            await user.save();
        }
        res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    console.log("blokUser error",error);
    res.status(500).json({ message: 'Internal server error', error });
  }
 }

const unblockUser = async(req,res) =>{
    try {
        const {unblockUserId} = req.body
       // console.log(unblockUserId)
        const userId = req.user._id
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.blockedUsers = user.blockedUsers.filter(id => id.toString()!== unblockUserId);
        await user.save();
        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        console.log("unblokUser error",error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}
 export {blockUser,unblockUser};