const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    console.log('Auth Middleware - Token:', token);

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET || 'fallback_secret_key'); // Use your secret key here
        req.user = decoded; // decoded contains the user's ID and other info
      
        next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
