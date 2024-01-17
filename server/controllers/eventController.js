const Event = require("../models/eventModel.js");
const Forms = require("../models/formModel.js");
const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const createFormSchema = (fields) => {
    const schemaDefinition = {};
    fields.forEach((field) => {
        schemaDefinition[field.name] = { type: field.type, required: true };
    });
    return schemaDefinition;
};
const makeCollectionName = (eventName) => {
    const collectionName =
        eventName.toLowerCase().replace(/ /g, "_") + "_response";
    return collectionName;
};

const getAllEvents = wrapAsync(async (req, res) => {
    const allEvents = await Event.find();
    return res.status(200).json(allEvents);
});

const getSingleEvent = wrapAsync(async (req, res) => {
    const concatEventName = req.params.id;
    const singleEvent = await Event.findOne({ concatEventName: concatEventName });
    if (!singleEvent) throw new ExpressError("Event not found", 404);

    res.status(200).json(singleEvent);
});

const addEvent = wrapAsync(async (req, res) => {
    const { eventName, eventDate, name, desc, deadline, formFields } = req.body;
    const concatEventName = eventName.toLowerCase().split(" ").join("");
    const _event = concatEventName;
    await Forms.create({ name, desc, deadline, formFields, _event });
    const createdEvent = await Event.create({
        eventName,
        eventDate,
        concatEventName,
    });
    res.status(200).json(createdEvent);
});

const updateEvent = wrapAsync(async (req, res) => {
    const concatEventName = req.params.id;
    const updatedEvent = await Event.findOneAndUpdate(
        { concatEventName: concatEventName },
        { ...req.body },
        { new: true }
    ); // in earlier versions default value of new was true, but now we must mention explicitly.
    if (!updatedEvent) throw new ExpressError("Event not found", 404);

    res.status(200).json(updatedEvent);
});

const deleteEvent = wrapAsync(async (req, res) => {
    const concatEventName = req.params.id;
    const deletedEvent = await Event.findOneAndDelete({ concatEventName: concatEventName });

    if (!deletedEvent) throw new ExpressError("Event not found", 404);

    res.status(200).json(deletedEvent);
});

const submitResponse = async (req, res) => {
    const concatEventName = req.params.id;
    await Forms.findOneAndUpdate({
        query: { _event: concatEventName },
        update: { $push: { responses: req.body } },
        options: { new: true } 
    });
res.status(200).json("Response Saved Successfully");
};

const getResponses = async (req, res) => {
    const concatEventName = req.params.id;
    const responses = await Forms.findOne({ _event: concatEventName }).select({responses: true});
    if (!responses) throw new ExpressError("Event not found", 404);
    res.status(200).json(responses);
};

const getFormFields = async (req, res) => {
    const concatEventName = req.params.id;
    const formFields = await Forms.findOne({ _event: concatEventName }).select({formFields: true});
    if (!formFields) throw new ExpressError("Event not found", 404);
    res.status(200).json(formFields);
}

module.exports = {
    getAllEvents,
    getSingleEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    submitResponse,
    getResponses,
    getFormFields
};