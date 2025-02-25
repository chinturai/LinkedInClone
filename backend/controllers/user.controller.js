import User from "../models/user.model.js";

//To display suggested users in right side homepage
export const getSuggestedConnections = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("connections");

        // Suggested Connections --> All users who are NOT your connections + Excluding Yourself
        const suggestedUser = await User.find({
            _id: {
                $ne: req.user._id, // ne = not equal
                $nin: currentUser.connections // nin = not in
            }
        }).select("name username profilePicture headline").limit(3); // Selecting 3 Users and fetching the specified data

        res.json(suggestedUser);

    } catch (error) {
        console.log("Error in User Controller - getSuggestedConnections ");
        res.status(500).json({ message: "Error in Fetching Suggester Users ! " });
    }
}

//To view someone's profile, Eg--> linkedin.com/chinturai
export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);

    } catch (error) {
        console.log("Error in getPublicProfile Controller ");
        res.status(500).json({ message: "Internal Server Error (getPublicProfile)" });
    }
}

//Edit your Profile Details
export const updateProfile = async (req, res) => {
    try {
        //Fields that can be changed
        const allowedFields = [
            "name",
            "username",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education",
        ];

        //Check for fields that are being updated and Update them...
        const updatedData = {};

        for (const field of allowedFields) {
            if (req.body[field]) {
                updatedData[field] = req.body[field];
            }
        }

        //ToDo Check for Images --> Uploading to cloudinary


        //Update the user
        const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { $new: true }).select("-password");

        res.json(user);

    } catch (error) {
        console.log("Error in updateProfile Controller ");
        res.status(500).json({ message: "Internal Server Error (updateProfile)" });
    }
}
