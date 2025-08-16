const Question = require('../models/QuestionModel');
const User = require('../models/userModel');
const { sendEmail } = require('../utils/emailUtils');
const { newAnswerTemplate } = require('../utils/emailTemplates');

const createAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    const questionId = req.params.questionId;
    const author = req.user.id;

    const question = await Question.findById(questionId)
      .populate('askedBy')
      .populate('postId');
      
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const answer = {
      content,
      author,
      createdAt: new Date()
    };

    question.answers.push(answer);
    await question.save();

    // Send email notification to the person who asked the question
    if (question.askedBy.personalEmail && question.askedBy._id.toString() !== author) {
      const answeredBy = await User.findById(author);
      const emailContent = newAnswerTemplate(
        question.askedBy,
        question.postId.title,
        question.question,
        content,
        answeredBy,
        question.postId._id
      );
      await sendEmail({
        to: question.askedBy.personalEmail,
        ...emailContent
      });
    }

    // Populate the author details of the new answer
    const populatedQuestion = await Question.findById(questionId)
      .populate('answers.author', 'fullName linkedInProfile');

    const newAnswer = populatedQuestion.answers[populatedQuestion.answers.length - 1];

    res.status(201).json(newAnswer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const userId = req.user.id;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    if (answer.author.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this answer' });
    }

    answer.remove();
    await question.save();

    res.status(200).json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createAnswer, deleteAnswer };
