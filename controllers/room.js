// Controller handler to handle functionality in room page
const Chatroom = require('../models/Chatroom');
const Message = require('../models/Message');
const {roomIdGenerator} = require('../util/roomIdGenerator.js');

const createRoom = async (request, response) => {
  try {
    const roomName = request.body.roomName || roomIdGenerator();
    const roomId = roomIdGenerator();
    const newChatroom = new Chatroom({ name: roomName, roomId });
    await newChatroom.save();
    response.redirect(`/${newChatroom.roomId}`);
  } catch (error) {
    response.status(500).send(error.message);
  }
};

const getRoom = async (request, response) => {
  try {
    const roomName = request.params.roomName;
    const chatroom = await Chatroom.findOne({ roomId: roomName });
    if (!chatroom) {
      return response.status(404).send('Chatroom not found');
    }
    response.render('room', { title: 'Chatroom', roomName: chatroom.roomId });
  } catch (error) {
    response.status(500).send(error.message);
  }
};

const getMessages = async (request, response) => {
  try {
    const roomName = request.params.roomName;
    const messages = await Message.find({ roomId: roomName }).sort({ createdAt: 1 });
    response.json(messages);
  } catch (error) {
    response.status(500).send(error.message);
  }
};

const postMessage = async (request, response) => {
  try {
    const { nickname, text } = request.body;
    const roomName = request.params.roomName;
    const newMessage = new Message({ roomId: roomName, nickname, text, createdAt: new Date() });
    await newMessage.save();
    response.status(201).json(newMessage);
  } catch (error) {
    response.status(500).send(error.message);
  }
};

module.exports = { createRoom, getRoom, getMessages, postMessage };
