const express = require('express')
const router = express.Router()
const {
    loginUser,
    signupUser,
    signUpAlumni,
    forgotPassword,
    resetPassword,
    verifyAlumniEmail,
    verifyEmail,
    verifyPasswordResetEmail,
    verifyLogin
} = require('../controllers/authController.js')

// Auth
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.get('/verify/:token', verifyEmail);
router.post('/verify-login', verifyLogin);

// Alumni
router.post('/alumni/signup', signUpAlumni)
router.get('/alumni/verify/:token', verifyAlumniEmail)

// Password flows
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', verifyPasswordResetEmail);
router.put('/reset-password', resetPassword);


module.exports = router
