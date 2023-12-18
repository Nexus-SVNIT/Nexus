const Message = require('../models/messageModel.js');

const getAllMessages = async(req, res)=>{
    try {
        const allMessages = await Message.find();
        res.status(200).json(allMessages);
    } 
    catch (err) {
      console.log(err);  
    }
}
const addMessage = async(req, res)=>{
    try {
        const {name, email, message} = req.body;
        const newMessage = await Message.create({name, email, message});
        res.status(200).json(newMessage);
    } 
    catch (err) {
      console.log(err);  
    }
}
const getSingleMessage = async(req, res)=>{
    const id = req.params.id;
    try {
        const singleMessage = await Message.findById(id);
        res.status(200).json(singleMessage);
    } 
    catch (err) {
      console.log(err);  
    }
}

module.exports = {getAllMessages, addMessage, getSingleMessage};