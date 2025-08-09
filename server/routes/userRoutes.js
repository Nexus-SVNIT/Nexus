const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware.js');
const {
  loginUser,
  signupUser,
  verifyEmail,
  updateUserProfile,
  getUsers,
  getUserProfile,
  getAllUsers,
  forgotPassword,
  resetPassword,
  verifyPasswordResetEmail,
  generalNotification,
  getUserStats,
  getPendingAlumni,
  verifyAlumni,
  rejectAlumni,
  notifyBatch
} = require('../controllers/userController.js');
const Post = require('../models/postModel');

// Auth
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.get('/verify/:token', verifyEmail);

// Profile
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

// Users list
router.get('/get', coreAuthMiddleware, getUsers);
router.get('/get/all', coreAuthMiddleware, getAllUsers);

// Password flows
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', verifyPasswordResetEmail);



// Batch Notification
router.post('/notify-batch', coreAuthMiddleware, notifyBatch);

// Stats
router.get('/stats', coreAuthMiddleware, getUserStats);

// Posts
router.get('/posts', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .select('title company role createdAt');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Alumni
router.get('/alumni/pending', coreAuthMiddleware, getPendingAlumni);
router.post('/alumni/verify/:id', coreAuthMiddleware, verifyAlumni);
router.post('/alumni/reject/:id', coreAuthMiddleware, rejectAlumni);

module.exports = router;
