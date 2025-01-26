const express = require('express');
const { createPost, getAllPosts, getPostById } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new post
router.post('/',authMiddleware, createPost);

// Fetch all posts
router.get('/', getAllPosts);

// Fetch individual post
router.get('/:id', getPostById);

module.exports = router;