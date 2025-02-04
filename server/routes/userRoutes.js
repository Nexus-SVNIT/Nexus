const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have an auth middleware
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware.js'); // Assuming you have an auth middleware
const { loginUser, signupUser, verifyEmail, updateUserProfile, getUsers, getUserProfile, getAllUsers, forgotPassword, resetPassword, verifyPasswordResetEmail,generalNotification } = require('../controllers/userController.js')

router.post('/login', (req, res) => {
    loginUser(req, res);
})
router.post('/signup', (req, res) => {
    signupUser(req, res);
})
router.get('/verify/:token', verifyEmail);

// Route to get user profile (protected route)
router.get('/profile', authMiddleware, getUserProfile);

// Route to update user profile (protected route)
router.put('/profile', authMiddleware, updateUserProfile);

router.get('/get', coreAuthMiddleware, getUsers);
router.get('/get/all', coreAuthMiddleware, getAllUsers);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', verifyPasswordResetEmail);

router.post('/notify-subscribers', coreAuthMiddleware, async (req, res) => {
    const { subject, message } = req.body;

    try {
        await generalNotification(subject, message);
        res.status(200).json({ message: 'Subscribers notified successfully.' });
    } catch (error) {
        console.error(`Error notifying subscribers: ${error.message}`);
        res.status(500).json({ message: 'Error notifying subscribers.' });
    }
});


module.exports = router
