// this file will contain routes for member.

const express = require('express');
const { logRequest,validateMemberData} = require("../middleware.js");
const router = express.Router();
const {
    
    
    getAllMember,
    addMember,
    getUniqueMember,
    updateMemberDetails,
    deleteMember
} = require('../controllers/memberController');

router.use(logRequest); // Log request details

router.get('/', getAllMember);
router.post('/add',validateMemberData,addMember);
router.get('/:id', getUniqueMember);
router.put('/:id',validateMemberData, updateMemberDetails);
router.delete('/:id', deleteMember);



module.exports = router;
