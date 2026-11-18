import { Post } from "../models/post.model.js";

/**
 * @desc   CREATE a new post
 * @route  POST /api/v1/posts
 */
export const createPost = async (req, res) => {
  try {
    const { title, description, author, category } = req.body;

    if (!title || !description || !author) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and author are required fields",
      });
    }

    const newPost = await Post.create({
      title,
      description,
      author,
      category: category || "General",
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

/**
 * @desc   READ all posts
 * @route  GET /api/v1/posts
 */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

/**
 * @desc   READ a single post by ID
 * @route  GET /api/v1/posts/:id
 */
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid Post ID format or server error",
      error: error.message,
    });
  }
};

/**
 * @desc   UPDATE an existing post
 * @route  PUT /api/v1/posts/:id
 */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, author, category } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(title && { title }),
          ...(description && { description }),
          ...(author && { author }),
          ...(category && { category }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: `Post with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error.message,
    });
  }
};

/**
 * @desc   DELETE a post
 * @route  DELETE /api/v1/posts/:id
 */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: `Post with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: deletedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message,
    });
  }
};
