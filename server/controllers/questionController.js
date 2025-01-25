const Question = require('../models/QuestionModel');
const Post = require('../models/postModel');

// Create a new question
const createQuestion = async (req, res) => {
  try {
    console.log(req.body);
    const { question, postId } = req.body;
    const author=req.user.id;

    const newQuestion = new Question({ question, postId, author });
    const savedQuestion = await newQuestion.save();

    const post = await Post.findById(postId);
    post.questions.push(savedQuestion._id);
    await post.save();

    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get questions for a specific post
const getQuestionsByPost = async (req, res) => {
  try {
    const questions = await Question.find({ postId: req.params.postId }).populate('answers.author');
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Answer a question
const answerQuestion = async (req, res) => {
  try {
    const { content, author } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) return res.status(404).json({ error: 'Question not found' });

    question.answers.push({ content, author });
    await question.save();

    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createQuestion, getQuestionsByPost, answerQuestion };