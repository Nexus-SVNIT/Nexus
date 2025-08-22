const express = require('express');
const { getAllEvents, getUniqueYears, getEventsByYear } = require('../controllers/eventController.js');

const router = express.Router();

router.get('/', getAllEvents);
router.get('/unique-years', getUniqueYears);
router.get('/:year', getEventsByYear);

module.exports = router;