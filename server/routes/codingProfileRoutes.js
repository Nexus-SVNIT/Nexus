const express = require("express");
const axios = require("axios");
// const Redis = require('ioredis');
const { getProfile, getPlatformProfile, getContest, getCodingProfiles, fetchCodingProfiles, fetchAllCodingProfiles } = require("../controllers/codingProfileController");

const router = express.Router();

// Get API base URL from environment variables
const CODING_PROFILE_API = process.env.CODING_PROFILE_BASE_URL;

router.get("/users/:platform", getPlatformProfile);
router.get("/user/:platform/:userId", getProfile);
router.get("/contests", getContest);
router.get("/get-profiles", getCodingProfiles);
router.get("/fetch-profile", fetchCodingProfiles);
router.get("/fetch-platform", fetchAllCodingProfiles);

module.exports = router;
