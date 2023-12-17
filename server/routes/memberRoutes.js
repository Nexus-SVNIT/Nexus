// this file will contain routes for member.

const express = require('express');
const router = express.Router();
const {
    logRequest,
    errorHandler,
    getAllMember,
    getUniqueMember,
    updateMemberDetails,
    deleteMember
} = require('../controllers/memberController');

router.use(logRequest); // Log request details

router.get('/', getAllMember);
router.get('/:id', getUniqueMember);
router.put('/:id', updateMemberDetails);
router.delete('/:id', deleteMember);

router.use(errorHandler); // Error handling middleware

module.exports = router;
