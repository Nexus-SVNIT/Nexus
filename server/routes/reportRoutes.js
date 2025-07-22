const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { sendReport } = require('../controllers/reportController');

// POST /api/report
router.post('/', upload.single('image'), sendReport);

module.exports = router; 