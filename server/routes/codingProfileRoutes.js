const express = require("express");
const router = express.Router();
const axios = require("axios");

const CODING_PROFILE_API = process.env.CODING_PROFILE_BASE_URL;

// Route for creating an issue
router.get("/user/:platform/:id", async (req, res) => {
    const data = await axios.get(`${CODING_PROFILE_API}/user/${req.params.platform}/${req.params.id}`);
    res.json(data.data);
});

router.get("/contests/upcoming", async (req, res) => {
    const data = await axios.get(`${CODING_PROFILE_API}/contests/upcoming`);
    res.json(data.data);
});


module.exports = router;
