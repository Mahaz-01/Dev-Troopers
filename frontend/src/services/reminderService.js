import { api } from './api';

export const reminderService = {
  getReminders: async () => api.get('/reminders'),
  createReminder: async (reminderData) => api.post('/reminders', reminderData),
  updateReminder: async (id, reminderData) => api.put(`/reminders/${id}`, reminderData),
  deleteReminder: async (id) => api.delete(`/reminders/${id}`),
};