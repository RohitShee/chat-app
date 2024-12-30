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
    res.send('Login route');
}

const logout = async (req,res)=>{
    res.send('Logout route');
}

export {signup, login, logout};