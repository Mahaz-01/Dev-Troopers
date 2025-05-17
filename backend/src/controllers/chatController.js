const Message = require('../models/Message');

const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.findByUser(userId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiver_id, content } = req.body;
    const sender_id = req.user.id;
    const message = await Message.create({ sender_id, receiver_id, content });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getMessages,
  sendMessage
};