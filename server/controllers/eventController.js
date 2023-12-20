const Event = require('../models/eventModel.js');
const mongoose = require('mongoose');
const {logRequest}=require("../middleware.js");

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
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(300).json({ 'err': 'invalid id' });
    try {
        const singleEvent = await Event.findById(id);
        if (!singleEvent)
            return res.status(404).json({ 'err': 'event not found' });
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
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(300).json({ 'err': 'invalid id' });
    try {
        const updatedEvent = await Event.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true }); // in earlier versions default value of new was true, but now we must mention explicitly.
        if (!updatedEvent)
            return res.status(404).json({ 'err': 'event not found' });
        res.status(200).json(updatedEvent);
    }
    catch (err) {
        console.log(err);
    }
}
const deleteEvent = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(300).json({ 'err': 'invalid id' });
    try {
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent)
            return res.status(404).json({ 'err': 'event not found' });
        res.json(deletedEvent);
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = { getAllEvents, getSingleEvent, addEvent, updateEvent, deleteEvent };