const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.js');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware.js');
const { 
  submitResponse, 
  getFormFields, 
  getPublicForms,
  submitOpenResponse
} = require('../controllers/formController.js');

const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getPublicForms);
router.get('/all', coreAuthMiddleware, getAllForms);
router.get('/:id', getFormFields);
router.post('/submit/:id', authMiddleware, upload.single('file'), submitResponse);
router.post('/submit/open/:id', upload.single('file'), submitOpenResponse);

module.exports = router;
