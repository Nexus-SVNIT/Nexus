const express = require('express');
const { getAllEvents } = require('../controllers/eventController.js');

const router = express.Router();

router.get('/', getAllEvents);

module.exports = router;