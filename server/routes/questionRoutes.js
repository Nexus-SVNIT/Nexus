const express = require('express');
const { createQuestion, getQuestionsByPost, answerQuestion } = require('../controllers/questionController');
const router = express.Router();
const authMiddleware=require('../middlewares/authMiddleware')

router.post('/',authMiddleware, createQuestion);
router.get('/:postId',authMiddleware, getQuestionsByPost);
router.post('/:id/answer',authMiddleware, answerQuestion);

module.exports = router;