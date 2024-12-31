import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

const signup = async (req, res) => {
   const{email, fullName, password} = req.body;
    try {
    if(!email || !fullName || !password){
        return res.status(400).json({'message' : 'all fields required'});
    }
    if(password.length < 6){
        return res.status(400).json({'message': 'password must be atleast 6 characters long'})
    }
    if(await User.findOne({email})) {
        return res.status(400).json({'message': 'User with this email already exists'})
    }
    const salt = await bcrypt.genSalt(10)
   // console.log(salt)
    const hashedpassword = await bcrypt.hash(password, salt)
    const newUser = new User({
        email,
        fullName,
        password: hashedpassword
    })
    if(newUser){
        //console.log(newUser._id)
        generateToken(newUser._id,res)
        await newUser.save()
        return res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName,
            profilePic: newUser.profilePic,
            token: generateToken(newUser._id,res)
        })
    }else{
        return res.status(400).json({'message': 'User could not be created'})
    }
   } catch (error) {
    console.log("Signup Controller error: "+error)
    res.status(500).json({
    'message': 'internal server error'
    })
   }
}

const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
             return res.status(400).json({'message' : 'Invalid Credential'});
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
             return res.status(400).json({'message' : 'Invalid Credential'});
        }
        generateToken(user._id,res);
        return res.status(200).json({
             _id: user._id,
             email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log('login controller error: '+error)
        return res.status(500).json({'message' : 'Internal Server Error'})
    }
}

const logout = async (req,res)=>{
   try {
    res.cookie('jwt','',{maxAge: 0})
    res.status(200).json({'message':'Logged out Successfully'})
   } catch (error) {
    console.log('login controller error: '+error)
    return res.status(500).json({'message' : 'Internal Server Error'})
   }
}

const updateProfile = async(req,res) =>{
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic){
          return res.status(400).json({'message' : 'profile Picture is required'});
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId,
            {profilePic :  uploadResponse.secure_url},
            {new : true});
        return res.status(200).json(updatedUser)
    } catch (error) {
        console.log('error in uplaod profile : '+ error)
        return res.status(500).json({'message' : 'Internal Server Error'})
    }

}

const checkAuth = async(req,res) =>{
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log('checkAuth controller error: '+error)
        return res.status(500).json({'message' : 'Internal Server Error'})
    }
}

export {signup, login, logout,updateProfile,checkAuth};