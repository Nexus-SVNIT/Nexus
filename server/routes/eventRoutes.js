const express = require('express');
const {getAllEvents, getSingleEvent, addEvent, updateEvent, deleteEvent} = require('../controllers/eventController.js');

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getSingleEvent);
router.post('/create', addEvent);
router.patch('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;