// this file will contain routes for member.
const express = require('express');
const requireAuth = require('../middlewares/requireAuth.js');
const { logRequest, validateMemberData } = require("../middleware.js");
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
router.post('/add', requireAuth, validateMemberData, addMember);
router.get('/:id', getUniqueMember);
router.put('/:id', requireAuth, validateMemberData, updateMemberDetails);
router.delete('/:id', requireAuth, deleteMember);



module.exports = router;
