const express = require('express');
const requireAuth = require('../middlewares/requireAuth.js');
const { signUpAlumni, getPendingAlumniDetails, toggleVerification, getAllAlumniDetails ,verifyAlumniEmail} = require('../controllers/alumniController.js');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const router = express.Router();

const multer = require('multer');
const path = require('path');

// Configure multer to store files in the writable /tmp directory


// Define routes

router.get('/pending',coreAuthMiddleware, getPendingAlumniDetails);
router.get('/',authMiddleware, getAllAlumniDetails);
router.patch('/:id',coreAuthMiddleware, toggleVerification);

module.exports = router;
