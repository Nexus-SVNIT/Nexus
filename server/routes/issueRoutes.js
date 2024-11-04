const express = require("express");
const router = express.Router();
const {createIssue}=require("../controllers/issueController");

// Route for creating an issue
router.post("/create", createIssue);

module.exports = router;
