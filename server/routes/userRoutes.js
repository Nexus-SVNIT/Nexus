const express = require('express')
const router = express.Router()
const { loginUser, signupUser } = require('../controllers/userController.js')

router.post('/login', (req, res) => {
    loginUser(req, res)
})
router.post('/signup', (req, res) => {
    signupUser(req, res)
})

module.exports = router
