const express = require("express");
const router = express.Router();
const { getContributors } = require("../controllers/contributorsController");

router.get("/get", getContributors);

module.exports = router;