const express = require('express');
const { createPost, getAllPosts, getPostById, getPendingPosts, verifyPost } = require('../controllers/postController');
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


module.exports = router;