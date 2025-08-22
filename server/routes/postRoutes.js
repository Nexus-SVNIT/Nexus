const express = require('express');
const { createPost, getAllPosts, getPostById, updatePost, incrementPostView, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', authMiddleware, updatePost);
router.post('/', authMiddleware, createPost);
router.post('/:id/increment-view', incrementPostView);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;