import { api } from './api';

export const chatService = {
  getChatRooms: async () => api.get('/chat/rooms'),
  getMessages: async (chatRoomId) => api.get(`/chat/messages/${chatRoomId}`),
  sendMessage: async (messageData) => api.post('/chat/messages', messageData),
};