import { api } from './api';

export const reminderService = {
  getReminders: async () => api.get('/reminders'),
  addReminder: async (reminder) => api.post('/reminders', reminder),
};