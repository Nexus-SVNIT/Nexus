const express = require('express');
const { getAllCompanies, getCompanyByName, createCompany } = require('../controllers/companyController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', getAllCompanies);
router.get('/:name', getCompanyByName);

router.post('/', authMiddleware, createCompany);

module.exports = router;