import Post from './../models/post.model.js';
import cloudinary from './../lib/cloudinary.js';

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post
            .find({ author: { $in: req.user.connections } }) //Get the user's connections
            .populate("author", "name username profilePicture headline") //Populate the post's AUTHOR's fields
            .populate("comments.user", "name profilePicture") //Populate the Comments with the fields
            .sort({ createdAt: -1 });// Sorts the posts in Latest to oldest order

        res.status(200).json(posts);

    } catch (error) {
        console.error("Error in Post Controller (getFeedPosts)", error.message);
        res.status(500).json({ message: "Internal Server Error (getFeedPosts)" });
    }
}

export const createPost = async (req, res) => {
    try {
        const {content , image} = req.body;

        let newPost;

        //We have to check whether the post has an image
        if (image) { // If the post has an image
            const imageResult = await cloudinary.uploader.upload(image);
            newPost = new Post({
                author: req.user._id , 
                content : content , 
                image : imageResult.secure_url
            });
        } 
        else { // If the post doesnt have an image
            newPost = new Post({
                author: req.user._id , 
                content : content
            });
        }

        // Save the post in the datbase 
        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        console.error("Error in Post Controller (createPost)", error.message);
        res.status(500).json({ message: "Internal Server Error (createPost)" });
    }
}

export const deletePost = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Error in Post Controller (deletePost)", error.message);
        res.status(500).json({ message: "Internal Server Error (deletePost)" });
    }
}