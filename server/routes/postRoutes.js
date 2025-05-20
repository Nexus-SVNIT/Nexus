const express = require('express');
const { createPost, getAllPosts, getPostById, getPendingPosts, verifyPost,updatePost } = require('../controllers/postController');
const Post = require('../models/postModel'); // Add this line
const authMiddleware = require('../middlewares/authMiddleware');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware');
const { updateEvent } = require('../controllers/eventController');
const router = express.Router();

router.get('/', getAllPosts); // Remove authMiddleware
router.post('/', authMiddleware, createPost);
router.get('/pending', coreAuthMiddleware, getPendingPosts);
router.get('/:id', getPostById); // Remove authMiddleware
// router.get('/:id', authMiddleware, getPostById); // Remove authMiddleware
router.post('/:postId/verify', coreAuthMiddleware, verifyPost);
router.put('/:id', authMiddleware, updatePost);
      

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

// Add delete route before module.exports
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;