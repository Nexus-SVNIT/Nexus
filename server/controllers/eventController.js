const Event = require('../models/eventModel.js');
const mongoose = require('mongoose');
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const getAllEvents = wrapAsync(async (req, res) => {
    const allEvents = await Event.find();
    res.json(allEvents);
});

const getSingleEvent = wrapAsync(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ExpressError('Invalid id', 400);

    const singleEvent = await Event.findById(id);
    if (!singleEvent)
        throw new ExpressError('Event not found', 404);

    res.json(singleEvent);
});


const addEvent = wrapAsync(async (req, res) => {
    const { eventName, eventDate } = req.body;
    const createdEvent = await Event.create({ eventName, eventDate });
    res.json(createdEvent);
});


const updateEvent = wrapAsync(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ExpressError('Invalid id', 400);

    const updatedEvent = await Event.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true }); // in earlier versions default value of new was true, but now we must mention explicitly.
    if(!updatedEvent)
        throw new ExpressError('Event not found', 404);

    res.json(updatedEvent);
    
});

const deleteEvent = wrapAsync(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ExpressError('Invalid id', 400);

    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent)
        throw new ExpressError('Event not found', 404);

    res.json(deletedEvent);
});

module.exports = { getAllEvents, getSingleEvent, addEvent, updateEvent, deleteEvent};