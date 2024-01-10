const Event = require("../models/eventModel.js");
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
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ExpressError("Invalid id", 400);

    const singleEvent = await Event.findById(id);
    if (!singleEvent) throw new ExpressError("Event not found", 404);

    res.status(200).json(singleEvent);
});

const addEvent = wrapAsync(async (req, res) => {
    const { eventName, eventDate, formFields } = req.body;
    const concatenatedEventName = eventName
        .split("")
        .map((char) => char.toLowerCase())
        .join("");
    const formSchema = createFormSchema(formFields);
    const collectionName = makeCollectionName(eventName);
    const createdEvent = await Event.create({
        eventName,
        eventDate,
        formFields,
        responseCollectionName: collectionName,
        responseSchema: formSchema,
    });
    res.status(200).json(createdEvent);
});

const updateEvent = wrapAsync(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ExpressError("Invalid id", 400);

    const updatedEvent = await Event.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true }
    ); // in earlier versions default value of new was true, but now we must mention explicitly.
    if (!updatedEvent) throw new ExpressError("Event not found", 404);

    res.status(200).json(updatedEvent);
});

const deleteEvent = wrapAsync(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ExpressError("Invalid id", 400);

    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) throw new ExpressError("Event not found", 404);

    res.status(200).json(deletedEvent);
});

const submitResponse = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ExpressError("Invalid id", 400);

    const singleEvent = await Event.findById(id);
    if (!singleEvent) throw new ExpressError("Event not found", 404);
    const collectionName = singleEvent.responseCollectionName;
    const responseSchema = mongoose.Schema(singleEvent.responseSchema);
    let ResponseCollection;
    if (!mongoose.models[collectionName])
        ResponseCollection = mongoose.model(collectionName, responseSchema);
    // it should be mongoose.models[] and not mongoose.model[]
    else ResponseCollection = mongoose.models[collectionName];
    const savedResponse = await ResponseCollection.create(req.body);
    res.status(200).json(savedResponse);
};

const getResponses = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        throw new ExpressError("Invalid id", 400);

    const singleEvent = await Event.findById(id);
    if (!singleEvent) throw new ExpressError("Event not found", 404);
    const collectionName = singleEvent.responseCollectionName;
    const responseSchema = mongoose.Schema(singleEvent.responseSchema);
    let ResponseCollection;
    if (!mongoose.models[collectionName])
        ResponseCollection = mongoose.model(collectionName, responseSchema);
    // it should be mongoose.models[] and not mongoose.model[]
    else ResponseCollection = mongoose.models[collectionName];
    const allResponses = await ResponseCollection.find();
    res.status(200).json(allResponses);
};

module.exports = {
    getAllEvents,
    getSingleEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    submitResponse,
    getResponses,
};
