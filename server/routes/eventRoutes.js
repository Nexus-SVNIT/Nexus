const express = require('express');
const { logRequest,validateEventData} = require("../middleware.js");
const {getAllEvents, getSingleEvent, addEvent, updateEvent, deleteEvent} = require('../controllers/eventController.js');

const router = express.Router();
router.use(logRequest);

router.get('/', getAllEvents);
router.get('/:id', getSingleEvent);
router.post('/create', validateEventData,addEvent);
router.patch('/:id',validateEventData, updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;