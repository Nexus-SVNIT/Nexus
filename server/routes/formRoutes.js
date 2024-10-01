const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.js');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware.js');
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
router.post('/create', coreAuthMiddleware, createForm);
router.post('/submit/:id', authMiddleware, submitResponse);
router.get('/get-responses/:id', coreAuthMiddleware, getResponses);
router.get('/:id', getFormFields);

// New route for updating form status
router.patch('/update-status/:id', coreAuthMiddleware, updateFormStatus);

// Route to update form deadline
router.patch('/update-deadline/:id', coreAuthMiddleware,updateFormDeadline);

module.exports = router;
