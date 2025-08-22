const express = require('express');
const { createComment, getCommentsByPost } = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/',authMiddleware, createComment);
router.get('/:postId', getCommentsByPost);

module.exports = router;