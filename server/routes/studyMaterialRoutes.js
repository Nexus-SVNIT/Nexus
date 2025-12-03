const express = require('express');
const router = express.Router();

const {
    listSubjects,
    listAllSubjects,
    getSubject
} = require('../controllers/studyMaterialController');

const auth = require('../middlewares/authMiddleware');

// GET /subjects?category=Semester Exams&department=CSE
router.get('/subjects', auth, listSubjects);

// GET /subjects/all
router.get('/subjects/all', auth, listAllSubjects);

// GET /subjects/:id
router.get('/subjects/:id', auth, getSubject);

module.exports = router;
