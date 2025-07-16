const jwt = require('jsonwebtoken');
const user = require('../models/userModel');

const alumniMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET); 

        // check it's an alumni user
        if (!decoded.isAlumni) {
            return res.status(401).json({ message: 'Unauthorized access (not alumni)' });
        }

        // Ensure the alumni exists in DB
        const foundUser = await user.findById(decoded.id);
        if (!foundUser) {
            return res.status(401).json({ message: 'Alumni not found in the system' });
        }
        
        next(); // Proceed to the next middleware/controller

    } catch (error) {
        console.error('JWT verification failed:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = alumniMiddleware;
