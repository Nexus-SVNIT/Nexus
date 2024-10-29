const express = require('express');
const requireAuth = require('../middlewares/requireAuth.js');
const { allAlumniDetails, addAlumniDetails, allPendingAlumniDetails, allVerifiedAlumniDetails, toggleVerification } = require('../controllers/alumniController.js');
const router = express.Router();

const multer = require('multer');
const path = require('path');

// Configure multer to store files in the writable /tmp directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp'); // Use /tmp as the temporary directory for serverless environments
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Define routes
router.get('/', allVerifiedAlumniDetails);
router.get('/pending', allPendingAlumniDetails);
router.post('/add', upload.single('ImageLink'), addAlumniDetails);
router.get('/all', allAlumniDetails);
router.patch('/:id', toggleVerification);

module.exports = router;
