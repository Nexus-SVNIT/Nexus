const Event = require('../models/eventModel.js');

const addEvent = async (req, res)=>{
    const {eventName, eventDate} = req.body;
    try {
        const created_event = await Event.create({eventName, eventDate}); 
        res.json(created_event);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {addEvent};