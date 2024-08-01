const express = require('express');
const requireAuth = require('../middlewares/requireAuth.js');
const { logRequest, validateEventData } = require('../middleware.js');
const { 
  getAllForms, 
  createForm, 
  submitResponse, 
  getResponses, 
  getFormFields, 
  getPublicForms,
  updateFormStatus,
  updateFormDeadline

} = require('../controllers/formController.js');

const router = express.Router();

// Routes
router.get('/', getPublicForms);
router.get('/all', getAllForms);
router.post('/create', createForm);
router.post('/submit/:id', submitResponse);
router.get('/get-responses/:id', getResponses);
router.get('/:id', getFormFields);

// New route for updating form status
router.patch('/update-status/:id', updateFormStatus);

// Route to update form deadline
router.patch('/update-deadline/:id',updateFormDeadline);

module.exports = router;
