// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const {
    getOngoingProjects,
    createProject,
} = require('../controllers/projectController');

// GET ongoing projects
router.get('/ongoing', getOngoingProjects);

// POST create a new project
router.post('/', createProject);

module.exports = router;
