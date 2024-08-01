const express = require('express')
const requireAuth = require('../middlewares/requireAuth.js')
const { allAlumniDetails, addAlumniDetails, allVerifiedAlumniDetails } = require('../controllers/alumniController.js')

const router = express.Router()
// router.use(logRequest)
router.get('/', allVerifiedAlumniDetails)
router.post('/add', addAlumniDetails)
router.get('/all', allAlumniDetails)

module.exports = router
