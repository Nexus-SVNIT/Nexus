const express = require('express');
const requireAuth = require('../middlewares/requireAuth.js');
const { logRequest, validateEventData } = require("../middleware.js");
const {getAllForms, createForm, submitResponse, getResponses, getFormFields} = require('../controllers/formController.js');

const router = express.Router();

router.get('/', getAllForms);
router.post('/create', requireAuth, createForm);
router.post('/submit/:id', submitResponse);
router.get('/get-responses/:id', requireAuth, getResponses);
router.get('/get-fields/:id', getFormFields);

module.exports = router;