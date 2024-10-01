const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware.js'); // Assuming you have an auth middleware
const { loginUser } = require('../controllers/coreController.js')

router.post('/login', (req, res) => {
    loginUser(req, res)
})


module.exports = router
