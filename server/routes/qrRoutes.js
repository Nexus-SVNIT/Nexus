const express = require('express');
const { redirectDefaultQr } = require('../controllers/qrRedirectController');

const router = express.Router();

router.get('/', redirectDefaultQr);

module.exports = router;
