const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  updateUserProfile,
  getUserProfile,
  getUserPosts
} = require('../controllers/userController.js');

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/posts', authMiddleware, getUserPosts);


module.exports = router;

