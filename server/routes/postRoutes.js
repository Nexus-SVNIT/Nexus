const express = require('express');
const { createPost, getAllPosts, getPostById, getPendingPosts, verifyPost } = require('../controllers/postController');
const Post = require('../models/postModel'); // Add this line
const authMiddleware = require('../middlewares/authMiddleware');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware');
const router = express.Router();

// Create a new post
router.post('/',authMiddleware, createPost);

// Fetch all posts
router.get('/', getAllPosts);

// Admin routes with core auth middleware
router.get('/pending', coreAuthMiddleware, getPendingPosts);
router.post('/:postId/verify', coreAuthMiddleware, verifyPost);

// Fetch individual post
router.get('/:id', getPostById);

// Add before module.exports
router.post('/:id/increment-view', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.json({ views: post.views });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;