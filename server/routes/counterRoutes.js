const express = require('express');
const router = express.Router();
const { getCount, incrementCount } = require('../controllers/counterController');

// Get current count
router.get('/', getCount);

// Increment count
router.post('/increment', incrementCount);

module.exports = router;
