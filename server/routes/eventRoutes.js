const express = require('express');
const {addEvent} = require('../controllers/eventController.js');

const router = express.Router();

router.post('/create', addEvent);

module.exports = router;