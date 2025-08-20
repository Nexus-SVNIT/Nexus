// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const {
    getOngoingProjects,
} = require('../controllers/projectController');

router.get('/ongoing', getOngoingProjects);

module.exports = router;
