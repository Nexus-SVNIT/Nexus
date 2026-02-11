const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware.js');
const {
  addAchievement,
  allAchievements
} = require('../controllers/achievementController.js');
const multer = require('multer');


// Configure multer to store files in the writable /tmp directory
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, '/tmp'); // Use /tmp as the temporary directory for serverless environments
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/', allAchievements);
router.post('/add', authMiddleware, upload.fields(
  [
    { name: 'image', maxCount: 1 },
    { name: 'proof', maxCount: 1 }
  ]
), addAchievement);

module.exports = router;