const express = require('express');
const router = express.Router();
const { markAlumniAutomation } = require('../controllers/automationController');

// Simple bearer token auth for automation
router.post('/mark-alumni', async (req, res) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (token !== process.env.API_SECRET) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    await markAlumniAutomation(req, res);
});

module.exports = router;
