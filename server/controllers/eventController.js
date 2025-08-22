const Event = require("../models/eventModel.js");

const getAllEvents = async (req, res) => {
    try{
        const allEvents = await Event.find();
        return res.status(200).json({ success: true, data: allEvents});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    getAllEvents
};