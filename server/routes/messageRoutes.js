const express = require('express');
const {getAllMessages, getSingleMessage, addMessage} = require('../controllers/messageController.js');

const router = express.Router();

router.get('/', getAllMessages);
router.get('/:id', getSingleMessage);
router.post('/', addMessage);

module.exports = router;