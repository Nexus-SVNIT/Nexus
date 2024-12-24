const express = require("express");
const axios = require("axios");
const redis = require("../utils/redisClient");

const router = express.Router();

// Get API base URL from environment variables
const CODING_PROFILE_API = process.env.CODING_PROFILE_BASE_URL;

// Route for getting user data
router.get("/user/:platform/:id", async (req, res) => {
    const cacheKey = `user:${req.params.platform}:${req.params.id}`;

    try {
        // Check if data is already in Redis cache
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            console.log("Cache hit");
            return res.json(JSON.parse(cachedData)); // Return cached data if available
        }

        console.log("Cache miss");
        // If data is not in cache, fetch from the external API
        const response = await axios.get(`${CODING_PROFILE_API}/user/${req.params.platform}/${req.params.id}`);

        // Cache the response for 3 days (259200 seconds)
        await redis.setex(cacheKey, 259200, JSON.stringify(response.data));
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching user data:", error.message);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});

// Route for getting upcoming contests
router.get("/contests/upcoming", async (req, res) => {
    const cacheKey = `contests:upcoming`;

    try {
        // Check if contests data is already in Redis cache
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            console.log("Cache hit");
            return res.json(JSON.parse(cachedData));
        }

        console.log("Cache miss");
        // Fetch data from the external API
        const response = await axios.get(`${CODING_PROFILE_API}/contests/upcoming`);

        // Cache the contests data for 12 hours (43200 seconds)
        await redis.setex(cacheKey, 43200, JSON.stringify(response.data));
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching upcoming contests:", error.message);
        res.status(500).json({ error: "Failed to fetch contests" });
    }
});

module.exports = router;
