const express = require("express");
const router = express.Router();
const {createIssue, getIssues}=require("../controllers/issueController");
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware');

// Route for creating an issue
router.post("/create", createIssue);
// Admin route for paginated issues
router.get("/admin", coreAuthMiddleware, getIssues);

module.exports = router;
