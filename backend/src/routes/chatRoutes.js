const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

module.exports = (io) => {
  router.get('/rooms', authMiddleware, chatController.getChatRooms);
  router.get('/messages/:chatRoomId', authMiddleware, chatController.getMessages);
  router.post('/messages', authMiddleware, chatController.sendMessage(io));
  router.post('/rooms', authMiddleware, chatController.createChatRoom);
  return router;
};