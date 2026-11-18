import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

const router = Router();

// CRUD Routes for Posts
router.route("/").post(createPost).get(getAllPosts);
router.route("/:id").get(getPostById).put(updatePost).delete(deletePost);

export default router;
