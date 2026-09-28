const express = require("express");
const { getContest, getCodingProfiles, getCodingProfile, syncGitHubLeaderboard, syncCodeforcesLeaderboard } = require("../controllers/codingProfileController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/contests", getContest);
router.get("/get-profiles", getCodingProfiles);
router.get("/get-profile", authMiddleware, getCodingProfile);
router.post("/sync-github", syncGitHubLeaderboard);
router.post("/sync-codeforces", syncCodeforcesLeaderboard);

module.exports = router;

