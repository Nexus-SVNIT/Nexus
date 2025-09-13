const express=require('express');
const { getSubjects,getSubjectDetails }=require('../controllers/studyMaterialController');
const router=express.Router();


router.get('/subjects', getSubjects);
router.get('/subjects/:id', getSubjectDetails);


module.exports=router;