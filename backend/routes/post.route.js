import express from 'express';
import { protectRoute } from './../middlewares/auth.middleware.js';
import { getFeedPosts , createPost , deletePost } from '../controllers/post.controller.js';

const router = express.Router();

//Creating Routes related to posts
router.get("/", protectRoute, getFeedPosts);
router.get("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);

export default router;
