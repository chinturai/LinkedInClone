import Post from './../models/post.model.js';
import Notification from './../models/notification.model.js';
import cloudinary from './../lib/cloudinary.js';
import { sendCommentNotificationEmail } from '../emails/emailHandlers.js';

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post
            .find({ author: { $in: [...req.user.connections, req.user._id] } }) //Get the user's connections and urs 
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
        const { content, image } = req.body;

        let newPost;

        //We have to check whether the post has an image
        if (image) { // If the post has an image
            const imageResult = await cloudinary.uploader.upload(image);
            newPost = new Post({
                author: req.user._id,
                content: content,
                image: imageResult.secure_url
            });
        }
        else { // If the post doesnt have an image
            newPost = new Post({
                author: req.user._id,
                content: content
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
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        // Check if post exists
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        //You cannot delete the post if u r not the owner
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete the post" });
        }

        //If the post has an IMAGE then delete it from cloudinary 
        if (post.image) {
            // We have to extract the Image ID from the Cloudinary Image URL (atihs0bpomgfjolcmqz7) , so we use split and pop methods to grab that part of the url...
            //  https://res.cloudinary.com/ddlyljw6p/image/upload/v1740154547/atihs0bpomgfjolcmqz7.jpg
            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0])
        }

        //Deleting the Post !!
        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post has been deleted successfully !! " });


    } catch (error) {
        console.error("Error in Post Controller (deletePost)", error.message);
        res.status(500).json({ message: "Internal Server Error (deletePost)" });
    }
}

export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
            .populate("author", "name username profilePic headline")
            .populate("comments", "name username profilePic headline");

        res.status(200).json(post);

    } catch (error) {
        console.error("Error in Post Controller (getPostById)", error.message);
        res.status(500).json({ message: "Internal Server Error (getPostById)" });
    }
}

export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;

        const post = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: { user: req.user._id, content } } },//PostModel-->Comment-->Fields=User+Content
            { new: true }
        ).populate("author", "name email username headline profilePic");

        // Create Notification of Comment --> If comment is being done by some one else (not by post owner)
        if (post.author._id.toString() !== req.user._id.toString()) {
            const newNotification = new Notification({
                recipient: post.author,
                type: "comment",
                relatedUser: req.user._id,
                relatedPost: postId
            })

            await newNotification.save();

            //Sending an Email
            try {
                const postUrl = process.env.CLIENT_URL + "/post/" + postId;
                await sendCommentNotificationEmail(post.author.email, post.author.name, req.user.name, postUrl, content);
                // post.author.email = recipientEmail
                // post.author.name = recipientName
                // req.user.name = commenterName
                // postUrl = postUrl
                // content = commentContent
            } catch (error) {
                console.log("Error in sending comment email notification ", error.me);
            }


        }

        //Comment created !! Now return the post which has the new comment
        res.status(200).json(post);

    } catch (error) {
        console.error("Error in Post Controller (createComment)", error.message);
        res.status(500).json({ message: "Internal Server Error (createComment)" });
    }
}

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id; // ID of the post which u r liking
        const post = await Post.findById(postId); //T he post which u r liking
        const userId = req.user._id; // The person who is liking 

        // Handling Like and UnLike Mechanism
        if (post.likes.includes(userId)) //If user has already liked the post , then UnLike it
        {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
            //The filter method creates a new array by keeping only the elements that satisfy the given condition.
        }
        else // Else Like the post 
        {
            post.likes.push(userId);

            // Create a notification , when someone else likes the post , other than post owner
            if (post.author.toString() !== userId.toString()) {
                const newNotification = new Notification(
                    {
                        recipient: post.author,
                        type: "like",
                        relatedUser: userId,
                        relatedPost: postId
                    }
                )

                await newNotification.save();
            }
        }

        await post.save();

        res.status(200).json(post);

    } catch (error) {
        console.error("Error in Post Controller (likePost)", error.message);
        res.status(500).json({ message: "Internal Server Error (likePost)" });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const posts = await Post.find({ author: userId })
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (error) {
        console.error("Error in Post Controller (getUserPosts)", error.message);
        res.status(500).json({ message: "Internal Server Error (getUserPosts)" });
    }
}