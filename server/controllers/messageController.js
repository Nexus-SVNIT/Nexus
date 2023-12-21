const Message = require('../models/messageModel.js');
const mongoose = require('mongoose');
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const getAllMessages = wrapAsync(async (req, res) => {
  const allMessages = await Message.find();
  res.status(200).json(allMessages);
});

const addMessage = wrapAsync(async (req, res) => {
  const { name, email, message } = req.body;
  const newMessage = await Message.create({ name, email, message });
  res.status(200).json(newMessage);
});

const getSingleMessage = wrapAsync(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
      throw new ExpressError('Invalid id', 400);

  const singleMessage = await Message.findById(id);
  if (!singleMessage)
      throw new ExpressError('Message not found', 404);

  res.status(200).json(singleMessage);
});

module.exports = { getAllMessages, addMessage, getSingleMessage };