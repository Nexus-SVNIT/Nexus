const express = require('express')
const router = express.Router()
const { loginUser, signupUser } = require('../controllers/userController.js')
const { signupAlumni, verifyAlumniEmail } = require('../controllers/alumniController.js')

router.post('/login', (req, res) => {
    loginUser(req, res)
})
router.post('/signup', (req, res) => {
    signupUser(req, res)
})
router.post('/alumni/signup', (req, res) => {
    signupAlumni(req, res)
})

router.get('/alumni/verify/:token', (req, res) => {
    verifyAlumniEmail(req, res)
})

module.exports = router
