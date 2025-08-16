const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.js');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware.js');
const { 
  getAllForms, 
  createForm, 
  submitResponse, 
  getResponses, 
  getFormFields, 
  getPublicForms,
  updateFormStatus,
  updateFormDeadline,
  notifyAllSubscribers,
  updateForm,
  submitOpenResponse
} = require('../controllers/formController.js');

const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.get('/', getPublicForms);
router.get('/all', coreAuthMiddleware, getAllForms);
router.post('/create', coreAuthMiddleware, createForm);
router.post('/submit/:id', authMiddleware, upload.single('file'), submitResponse);
router.post('/submit/open/:id', upload.single('file'), submitOpenResponse);
router.get('/get-responses/:id', coreAuthMiddleware, getResponses);
// Add new route for leaderboard
// router.get('/reference/leaderboard/', getLeaderboard);
// Add new route for admin leaderboard
// router.get('/reference/admin-leaderboard/', coreAuthMiddleware, getAdminLeaderboard);
router.get('/:id', getFormFields);

// New route for updating form status
router.patch('/update-status/:id', coreAuthMiddleware, updateFormStatus);

// Route to update form deadline
router.patch('/update-deadline/:id', coreAuthMiddleware,updateFormDeadline);

// New route for updating forms
router.put('/update/:id', coreAuthMiddleware, updateForm);

//Route to notify subscribers
router.post('/notify-subscribers/:formId', coreAuthMiddleware,notifyAllSubscribers);



module.exports = router;
