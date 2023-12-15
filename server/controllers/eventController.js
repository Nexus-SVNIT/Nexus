const Event = require('../models/eventModel.js');

const getAllEvents = async (req, res)=>{
    try{
        const allEvents = await Event.find();
        res.json(allEvents);
    }
    catch(err){
        console.log(err)
    }

}
const addEvent = async (req, res)=>{
    const {eventName, eventDate} = req.body;
    try {
        const created_event = await Event.create({eventName, eventDate}); 
        res.json(created_event);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {getAllEvents, addEvent};