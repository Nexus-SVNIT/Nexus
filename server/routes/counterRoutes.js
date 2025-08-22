const express = require('express');
const router = express.Router();
const { getCount, incrementCount } = require('../controllers/counterController');

router.get('/', getCount);
router.post('/increment', incrementCount);

module.exports = router;
