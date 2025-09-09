const express=require('express');
const { handleRedirect } = require('../controllers/redirectController');
const coreAuthMiddleware=require("../middlewares/coreAuthMiddleware");
const authMiddleware = require('../middlewares/authMiddleware');
const {getSubjectsbyCategory,getResourcesBySubjectandSubCategory,addTips,addResource}=require("../controllers/resourcesController");
const router = express.Router();

router.get('/:category',authMiddleware,getSubjectsbyCategory);
router.get('/:subjectName/:subCategory',authMiddleware,getResourcesBySubjectandSubCategory);
router.post('/:subjectName/addtips',coreAuthMiddleware,addTips);
router.post('/addResource',coreAuthMiddleware,addResource);
router.get('/download/:id',authMiddleware, handleRedirect);

module.exports=router;