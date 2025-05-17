import { api } from './api';

export const taskService = {
  getTasks: async () => api.get('/tasks'),
  getTaskById: async (id) => api.get(`/tasks/${id}`),
  createTask: async (taskData) => api.post('/tasks', taskData),
  updateTask: async (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: async (id) => api.delete(`/tasks/${id}`),
};