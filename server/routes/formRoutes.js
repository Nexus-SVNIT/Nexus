const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.js');
const { 
  submitResponse, 
  getFormFields, 
  getPublicForms,
  submitOpenResponse
} = require('../controllers/formController.js');

const router = express.Router();
const multer = require('multer');
// const upload = multer({ storage: multer.memoryStorage() });
const upload = multer({ dest: 'uploads/'})

router.get('/', getPublicForms);
router.get('/:id', getFormFields);
router.post('/submit/:id', authMiddleware, upload.single('file'), submitResponse);
router.post('/submit/open/:id', upload.single('file'), submitOpenResponse);

module.exports = router;
