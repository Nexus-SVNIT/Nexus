const express=require('express');
const { getSubjects,getSubjectDetails,getAllSubjects }=require('../controllers/studyMaterialController');
const router=express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/subjects', authMiddleware ,getSubjects);
router.get('/subjects/:id', authMiddleware , getSubjectDetails);
router.get('/subjects-all', authMiddleware, getAllSubjects);



module.exports=router;