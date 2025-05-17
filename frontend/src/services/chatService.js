import { api } from './api';

export const chatService = {
  getMessages: async () => api.get('/chat'),
  sendMessage: async (messageData) => api.post('/chat', messageData),
};