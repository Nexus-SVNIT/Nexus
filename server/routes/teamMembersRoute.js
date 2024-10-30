const express = require('express');
const multer = require('multer');
const path = require('path');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware');
const { addTeamMember, getTeamMembersByYear, getUniqueYears } = require('../controllers/teamMembersController');

const router = express.Router();

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


// Route to add a team member with image upload
router.post('/add', coreAuthMiddleware, upload.single('image'), addTeamMember);

// Route to get team members by year
router.get('/unique-years', getUniqueYears);
router.get('/:year', getTeamMembersByYear);

module.exports = router;
