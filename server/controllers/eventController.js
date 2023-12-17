const Event = require('../models/eventModel.js');

const getAllEvents = async (req, res) => {
    try {
        const allEvents = await Event.find();
        res.json(allEvents);
    }
    catch (err) {
        console.log(err)
    }

}
const getSingleEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const singleEvent = await Event.findById(id);
        res.json(singleEvent);
    }
    catch (err) {
        console.log(err);
    }
}
const addEvent = async (req, res) => {
    const { eventName, eventDate } = req.body;
    try {
        const createdEvent = await Event.create({ eventName, eventDate });
        res.json(createdEvent);
    } catch (err) {
        console.log(err);
    }
}
const updateEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedEvent = await Event.findOneAndUpdate({_id: id}, {...req.body}, {new: true}); // in earlier versions default value of new was true, but now we must mention explicitly.
        res.status(200).json(updatedEvent);
    }
    catch (err) {
        console.log(err);
    }
}
const deleteEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedEvent = await Event.findByIdAndDelete(id);
        res.json(deletedEvent);
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {getAllEvents, getSingleEvent, addEvent, updateEvent, deleteEvent};