const jwt = require('jsonwebtoken');
const coreMember = require('../models/coreMember');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET); // Use your secret key here
        if(!decoded.isAdmin) 
            return res.status(401).json({ message: 'Unauthorised Access' });
        const user = coreMember.findById(decoded.id);
        if(!user) 
            return res.status(401).json({ message: 'Unauthorised Access' });
        next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
