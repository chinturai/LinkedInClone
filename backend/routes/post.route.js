import express from 'express';
import { protectRoute } from './../middleware/auth.middleware.js';
import { getFeedPosts , createPost , deletePost, getPostById,getUserPosts , createComment , likePost} from '../controllers/post.controller.js';

const router = express.Router();

//Creating Routes related to posts
router.get("/", protectRoute, getFeedPosts);
router.get("/:userId", protectRoute, getUserPosts); // experimenting
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.get("/:id", protectRoute, getPostById);
router.post("/:id/comment", protectRoute, createComment);
router.post("/:id/like", protectRoute, likePost);


export default router;
