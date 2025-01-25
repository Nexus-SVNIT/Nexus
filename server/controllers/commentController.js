const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { content, postId, author } = req.body;
    const comment = new Comment({ content, postId, author });
    const savedComment = await comment.save();

    const post = await Post.findById(postId);
    post.comments.push(savedComment._id);
    await post.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get comments for a specific post
const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate('author');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createComment, getCommentsByPost };