
// Middleware for logging request details
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Move to the next middleware/route handler
};



module.exports={logRequest};