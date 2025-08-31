const express = require('express');
const { getAllCompanies, getCompanyByName, createCompany,companyAIBot } = require('../controllers/companyController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', getAllCompanies);
router.get('/:name', getCompanyByName);
router.post('/ai-bot', companyAIBot);
router.post('/', authMiddleware, createCompany);

module.exports = router;