const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createIssue } = require("../controllers/issueController");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", upload.single('image'), createIssue);

module.exports = router;
