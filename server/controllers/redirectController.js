const mongoose = require('mongoose');
const resourceModel = require('../models/resourceModel'); // Adjust path if needed


const handleRedirect = async (req, res) => {
    try {
        // Get the unique ID from the URL path
        const { id } = req.params;

       
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid file identifier." });
        }

        
        const resource = await resourceModel.findById(id).select('Link');


        
        if (resource && resource.Link) {
            return res.redirect(resource.Link);
        } else {
            return res.status(404).json({ message: "File or link not found." });
        }
    } catch (err) {
        console.error("Redirect error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    handleRedirect
};