const express = require('express')
const requireAuth = require('../middlewares/requireAuth.js')
const { allAlumniDetails, addAlumniDetails } = require('../controllers/alumniController.js')

const router = express.Router()
// router.use(logRequest)
router.get('/', allAlumniDetails)
router.post('/add', addAlumniDetails)

module.exports = router
