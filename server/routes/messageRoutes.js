const express = require('express');
const { logRequest,validateMessageData} = require("../middleware.js");
const {getAllMessages, getSingleMessage, addMessage} = require('../controllers/messageController.js');

const router = express.Router();
router.use(logRequest);

router.get('/', getAllMessages);
router.get('/:id', getSingleMessage);
router.post('/',validateMessageData, addMessage);

module.exports = router;