const express = require('express')
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware.js')
const authMiddleware = require('../middlewares/authMiddleware.js')

const { addAchievement, allAchievements, pendingAchievements, verifyAchievement, unverifyAchievement } = require('../controllers/achievementController.js')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify your upload directory
const router = express.Router()
// router.use(logRequest)

router.get('/', allAchievements); // all verified achievements
router.get('/pending', pendingAchievements);
router.post('/add', authMiddleware, upload.single('image'), addAchievement);
router.patch('/verify/:id', coreAuthMiddleware, verifyAchievement);
router.patch('/unverify/:id', coreAuthMiddleware, unverifyAchievement); // Add this line


module.exports = router
