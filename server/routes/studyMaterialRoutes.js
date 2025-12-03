const express=require('express');
const { getSubjects, getResourcesBySubject }=require('../controllers/studyMaterialController');
const router=express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/subjects', authMiddleware ,getSubjects);
router.get('/subjects/:id', authMiddleware , getResourcesBySubject);

module.exports=router;