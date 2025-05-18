const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');

const getChatRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const chatRooms = await ChatRoom.findByUser(userId);
    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const chatRoomId = req.params.chatRoomId;
    const messages = await Message.findByChatRoom(chatRoomId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const sendMessage = (io) => async (req, res) => {
  try {
    const { chat_room_id, content } = req.body;
    const sender_id = req.user.id;
    const message = await Message.create({ chat_room_id, sender_id, content });
    const messageWithSender = await Message.findByChatRoom(chat_room_id);
    const sentMessage = messageWithSender.find((msg) => msg.id === message.id);
    io.to(`room-${chat_room_id}`).emit('newMessage', sentMessage);
    res.status(201).json(sentMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createChatRoom = async (req, res) => {
  try {
    const { name, userIds } = req.body;
    const creatorId = req.user.id;
    const allUserIds = [...new Set([creatorId, ...userIds])];
    const chatRoom = await ChatRoom.create(name, allUserIds);
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getChatRooms,
  getMessages,
  sendMessage,
  createChatRoom
};