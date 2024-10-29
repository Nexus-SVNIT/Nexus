const express = require('express');
const requireAuth = require('../middlewares/requireAuth.js');
const multer = require('multer');
const { allAlumniDetails, addAlumniDetails, allPendingAlumniDetails, allVerifiedAlumniDetails, toggleVerification } = require('../controllers/alumniController.js');

const router = express.Router();

// Configure multer to store file in memory
const upload = multer({ storage: multer.memoryStorage() });

// Define routes
router.get('/', allVerifiedAlumniDetails);
router.get('/pending', allPendingAlumniDetails);
router.post('/add', upload.single('ImageLink'), addAlumniDetails);
router.get('/all', allAlumniDetails);
router.patch('/:id', toggleVerification);

module.exports = router;
