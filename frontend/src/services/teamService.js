import { api } from './api';

export const teamService = {
  getTeams: async () => api.get('/teams'),
  createTeam: async (teamData) => api.post('/teams', teamData),
  addMember: async (teamId, userId) => api.post('/teams/members', { teamId, userId }),
  removeMember: async (teamId, userId) => api.delete('/teams/members', { data: { teamId, userId } }),
};