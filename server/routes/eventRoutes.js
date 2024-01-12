const express = require('express');
const requireAuth = require('../middlewares/requireAuth.js');
const { logRequest, validateEventData } = require("../middleware.js");
const { getAllEvents, getSingleEvent, addEvent, updateEvent, deleteEvent, submitResponse, getResponses, getFormFields } = require('../controllers/eventController.js');

const router = express.Router();
// router.use(logRequest);

router.get('/', getAllEvents);
router.get('/:id', getSingleEvent);
router.post('/create', requireAuth, addEvent);
router.patch('/:id', requireAuth, updateEvent);
router.delete('/:id', requireAuth, deleteEvent);
router.post('/submit/:id', submitResponse);
router.get('/get-responses/:id', requireAuth, getResponses);
router.get('/get-fields/:id', getFormFields);

module.exports = router;