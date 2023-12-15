const express = require('express');
const {getAllEvents, addEvent} = require('../controllers/eventController.js');

const router = express.Router();

router.get('/', getAllEvents);
router.post('/create', addEvent);

module.exports = router;