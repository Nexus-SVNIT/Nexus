const express = require('express');
const { getAllCompanies, getCompanyByName, createCompany } = require('../controllers/companyController');
const router = express.Router();

router.get('/', getAllCompanies);
router.get('/:name', getCompanyByName);
router.post('/', createCompany);

module.exports = router;