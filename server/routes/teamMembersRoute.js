const express = require('express');
const { getTeamMembersByYear, getUniqueYears } = require('../controllers/teamMembersController');

const router = express.Router();

router.get('/unique-years', getUniqueYears);
router.get('/:year', getTeamMembersByYear);

module.exports = router;
