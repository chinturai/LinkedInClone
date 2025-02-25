import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        // Grab the token
        const token = req.cookies("jwt-linkedin");
        //Check if the token exists 
        if(!token){
            res.status(401).json({message:"Token not provided - UnAuthorized Access"});
        }
        //Check if the token is valid 
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded){
            res.status(401).json({message:"InValid Token - UnAuthorized Access"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            res.status(401).json({message:"User not found"});
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in Protect Route Middleware");
        res.status(500).json({message:"You are trying to do an UnAuthorized Access..."});
    }   
}