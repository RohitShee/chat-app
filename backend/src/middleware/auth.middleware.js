import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({'message' : 'Unauthorized Access : NO Token found'});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({'message' : 'Unauthorized Access : Invalid Token'});
        }
        const user = await User.findById(decoded.userId).select('-password');
        if(!user){
            res.status(404).json({'message' : 'User doesn\'t exist'});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log('Authentication Check  error: '+error)
        return res.status(500).json({'message' : 'Internal Server Error'})
    }
}