const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { sendReport, getReports } = require('../controllers/reportController');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware');

// POST /api/report
router.post('/', upload.single('image'), sendReport);
// Admin route for paginated reports
router.get('/admin', coreAuthMiddleware, getReports);

module.exports = router; 