import User from './../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';


export const signup = async (req, res) => {
    try {
        //Taking data from the body
        const { name, username, email, password } = req.body;

        //Checking if all fields are filled
        if(!name || !username || !email || !password){
            return res.status(400).json({message:"All fields are required !! "});
        }
        
        //Checking if User with this EMAIL already exists or not...
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "User with this Email already exists" });
        }

        //Checking if User with this USERNAME already exists or not...
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "User with this Username already exists" });
        }

        //Password Length check
        const regex = /^(?=.*[\W_]).{6,}$/; // At least 6 characters and 1 special character
        if (!(regex.test(password))) {
            return res.status(400).json({ message: "Password must be at least 6 characters long and contain at least one special character" });
        }

        //If all test cases are passed, then proceed to Encrypt the password and create a user

        //Hashing the password (Secure conventions)
        const salt = await bcrypt.genSalt(10); // First generate a Salt
        const hashedPassword = await bcrypt.hash(password, salt); // Then Hash the password using the salt

        //Create the user and save in database
        const user = new User({
            name,
            email,
            username,
            password: hashedPassword,

        });
        await user.save();

        //Create Cookie using JWT 
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
        res.cookie("jwt-linkedin", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(201).json({ messgae: "User is created Successfully" });

        //TO-D0 Send WELCOME Mails

        const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;
        
        try {
            await sendWelcomeEmail(user.email, user.name, profileUrl );
        } catch (error) {
            console.error("Error in sending Welcome Email", error);
        }
    } catch (error) {
        console.log("Error in Signup : ", error.message);
        res.status(500).json({ messgae: "Internal Server Error (Signup)" });
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        
        // Checking if the user exists 
        const user = await User.findOne({username});
        if(!user) {
            return res.status(400).json({message:"User not found"});
        }

        //Check Password by comparing :
        // password --> What the user entered
        // user.password --> The hashed version stored in Database
        const isMatch = await bcrypt.compare(password, user.password); 

        if(!isMatch){
            return res.status(400).json({message:"Please check your Username / Password"});
        }

        // Create Token and Login
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
        res.cookie("jwt-linkedin", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(201).json({ messgae: "Logged In Successfully !! " });
 
    } catch (error) {
        console.log("Error in SignIn : ", error.message);
        res.status(500).json({ messgae: "Internal Server Error (SignIn)" });
    }
}

export const logout = (req, res) => {
    res.clearCookie("jwt-linkedin");
    res.json({message:"Logged Out Successfully"});
}

export const getCurrentUser = ()=>{
    
}
