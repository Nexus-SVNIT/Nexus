const express = require("express");
const router = express.Router();
const multer = require("multer");
const {createIssue, getIssues}=require("../controllers/issueController");
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware');

// Configure multer for handling FormData
const upload = multer({ storage: multer.memoryStorage() });

// Route for creating an issue
router.post("/create", upload.single('image'), createIssue);
// Admin route for paginated issues
router.get("/admin", coreAuthMiddleware, getIssues);

module.exports = router;
