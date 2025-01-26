const express = require('express');
const router = express.Router();
const { createAnswer, deleteAnswer } = require('../controllers/answerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/:questionId/answers', authMiddleware, createAnswer);
router.delete('/:questionId/answers/:answerId', authMiddleware, deleteAnswer);

module.exports = router;
