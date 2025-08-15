const jwt = require('jsonwebtoken');
const TeamMember = require('../models/teamMembersModel');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET);

       
        // Check if the token contains an admission number
        if (decoded.isAdmin) {
            // Find the team member by ID
            const teamMember = await TeamMember.findOne({ _id: decoded.id });
            
            if (teamMember && teamMember.priority < 3) {
                // If team member found, get user details for additional information
                const userDetails = await User.findOne({ admissionNumber: decoded.admissionNumber });
                
                // Set user info in request object
                req.user = {
                    id: teamMember._id,
                    admissionNumber: teamMember.admissionNumber,
                    role: teamMember.role,
                    email: userDetails?.personalEmail || '',
                 
                    year: teamMember.year,
                    priority: teamMember.priority
                };
                
                return next();
            }
        }
        
        // If no valid team member found, return unauthorized
        return res.status(401).json({ message: 'Unauthorized access' });
        
    } catch (error) {
        console.error('JWT verification failed:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
       