const jwt = require('jsonwebtoken');
const user = require('../models/userModel.js');

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization)
        res.status(401).json({ error: 'Authorization token required' });
    // get the second string from authorization
    const token = authorization.split(' ')[1];
    try {
        // it verifies and returns the token or the payload from that token and so we can grab the id from the payload

// NOTE: WHILE CREATING TOKEN I USED {id} AND NOT {_id} SO HERE ALSO I NEED TO WRITE {id}
        const { id } = jwt.verify(token, process.env.SECRET);
        // if the request is authorized then we attach the id of the user to req.user so that when it goes further i.e. to the controller functions we have that user and do something with it
        req.user = await user.findById(id).select('_id');
        // instead of req.user we can also write req.abc
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Request is not authorized' });
    }
}
module.exports = requireAuth;