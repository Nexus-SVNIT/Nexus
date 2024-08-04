// routes/panelRoutes.js

const express = require('express');
const { createPanels, getFormResponses } = require('../controllers/panelController');
const router = express.Router();

router.post('/create-panels', createPanels);
router.get('/forms/:formId/responses', getFormResponses);

module.exports = router;
