const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const { sendEmail } = require('../utils/emailUtils');
const { newCommentTemplate } = require('../utils/emailTemplates');

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const author = req.user.id;
    const comment = new Comment({ content, postId, author });
    const savedComment = await comment.save();

    const post = await Post.findById(postId).populate('author');
    post.comments.push(savedComment._id);
    await post.save();

    // Send email notification to post author if it's not their own comment
    // if (post.author._id.toString() !== author) {
      if (post.author.personalEmail) {
        const commentAuthor = await User.findById(author);
        const emailContent = newCommentTemplate(
          post.author,
          post.title,
          content,
          commentAuthor,
          post._id
        );
        await sendEmail({
          to: post.author.personalEmail,
          ...emailContent
        });
      }
    // }

    res.status(201).json(savedComment);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

// Get comments for a specific post
const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('author', 'fullName linkedInProfile admissionNumber')
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createComment, getCommentsByPost };