import User from './../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const signup = async (req, res) => {
    try {
        //Taking data from the body
        const { name, username, email, password } = req.body;

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

    } catch (error) {
        console.log("Error in Signup : ", error.message);
        res.status(500).json({ messgae: "Internal Server Error (Signup)" });
    }
}

export const login = (req, res) => {
    res.send("login");
}

export const logout = (req, res) => {
    res.send("logout");
}
