const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, {
    connectTimeout: 10000, 
});

redis.on("connect", () => {
    console.log("Connected to Redis Cloud");
});

redis.on("error", (err) => {
    console.error("Redis error:", err);
});

module.exports = redis;
