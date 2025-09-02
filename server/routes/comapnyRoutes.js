const express = require('express');
const { getAllCompanies, getCompanyByName, createCompany, companyAIBot } = require('../controllers/companyController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const aiRateLimit = require('../middlewares/aiRateLimit');

router.get('/', getAllCompanies);
router.get('/:name', getCompanyByName);

// Apply per-user daily limit (3) to AI bot
router.post('/ai-bot', authMiddleware, aiRateLimit, companyAIBot);

router.post('/', authMiddleware, createCompany);

module.exports = router;