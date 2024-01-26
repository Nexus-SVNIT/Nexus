const express = require('express')
const requireAuth = require('../middlewares/requireAuth.js')
const { addAchievement, allAchievements } = require('../controllers/achievementController.js')

const router = express.Router()
// router.use(logRequest)
router.get('/', allAchievements)
router.post('/add', addAchievement)

module.exports = router
