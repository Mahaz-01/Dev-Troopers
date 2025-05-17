import { api } from './api';

export const authService = {
  login: async (credentials) => api.post('/auth/login', credentials),
  logout: async () => api.post('/auth/logout'),
  signup: async (userData) => api.post('/auth/signup', userData),
};