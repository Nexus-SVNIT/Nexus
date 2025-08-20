const express = require('express');
const {  getAllAlumniDetails, getAllCompaniesAndExpertise} = require('../controllers/alumniController.js');
const router = express.Router();

router.get('/', getAllAlumniDetails);
router.get('/get-companies-and-expertise', getAllCompaniesAndExpertise);

module.exports = router;
