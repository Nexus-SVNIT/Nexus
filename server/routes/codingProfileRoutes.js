const express = require("express");
const { getContest, getCodingProfiles, getCodingProfile } = require("../controllers/codingProfileController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/contests", getContest);
router.get("/get-profiles", getCodingProfiles);
router.get("/get-profile", authMiddleware, getCodingProfile);

module.exports = router;
