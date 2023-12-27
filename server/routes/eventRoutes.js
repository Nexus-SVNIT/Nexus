const express = require('express');
const { logRequest,validateEventData} = require("../middleware.js");
const {getAllEvents, getSingleEvent, addEvent, updateEvent, deleteEvent, submitResponse, getResponses} = require('../controllers/eventController.js');

const router = express.Router();
// router.use(logRequest);

router.get('/', getAllEvents);
router.get('/:id', getSingleEvent);
router.post('/create',addEvent);
router.patch('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.post('/submit/:id', submitResponse);
router.get('/get-responses/:id', getResponses);

module.exports = router;