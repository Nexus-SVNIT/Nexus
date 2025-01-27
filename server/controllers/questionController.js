const Question = require('../models/QuestionModel');
const Post = require('../models/postModel');
const { sendEmail } = require('../utils/emailUtils');
const { newQuestionTemplate } = require('../utils/emailTemplates');
const User = require('../models/userModel');

// Create a new question
const createQuestion = async (req, res) => {
  try {
    console.log(req.body);
    const { question, postId } = req.body;
    const author = req.user.id;

    const newQuestion = new Question({ question, postId, askedBy: author });
    const savedQuestion = await newQuestion.save();

    const post = await Post.findById(postId).populate('author');
    post.questions.push(savedQuestion._id);
    await post.save();

    // Send email notification to post author
    if (post.author.personalEmail) {
      const askedByUser = await User.findById(author);
      const emailContent = newQuestionTemplate(
        post.author,
        post.title,
        question,
        askedByUser,
        post._id
      );
      await sendEmail({
        to: post.author.personalEmail,
        ...emailContent
      });
    }

    res.status(201).json(savedQuestion);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// Get questions for a specific post
const getQuestionsByPost = async (req, res) => {
  try {
    const questions = await Question.find({ postId: req.params.postId })
      .populate('askedBy', 'fullName linkedInProfile')
      .populate('answers.author', 'fullName linkedInProfile')
      .sort({ createdAt: -1 });
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