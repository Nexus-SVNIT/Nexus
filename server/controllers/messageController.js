const Message = require('../models/messageModel.js');
const mongoose = require('mongoose');

const getAllMessages = async (req, res) => {
  try {
    const allMessages = await Message.find();
    res.status(200).json(allMessages);
  }
  catch (err) {
    console.log(err);
  }
}
const addMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = await Message.create({ name, email, message });
    res.status(200).json(newMessage);
  }
  catch (err) {
    console.log(err);
  }
}
const getSingleMessage = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(300).json({ 'err': 'invalid id' });

  try {
    const singleMessage = await Message.findById(id);
    if (!singleMessage)
      return res.status(404).json({ 'err': 'message not found' });
    res.status(200).json(singleMessage);
  }
  catch (err) {
    console.log(err);
  }
}

module.exports = { getAllMessages, addMessage, getSingleMessage };