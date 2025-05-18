import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { teamService } from '../services/teamService';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserPlus, UserMinus, MessageCircle, Users } from 'lucide-react';

const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamService.getTeams();
      setTeams(response);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    try {
      const teamData = {
        name: newTeamName,
        memberIds: selectedUsers
      };
      await teamService.createTeam(teamData);
      setNewTeamName('');
      setSelectedUsers([]);
      setIsAddingTeam(false);
      fetchTeams();
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleAddMember = async (teamId, userId) => {
    if (!userId) return;
    try {
      await teamService.addMember(teamId, userId);
      fetchTeams();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (teamId, userId) => {
    if (!userId) return;
    try {
      await teamService.removeMember(teamId, userId);
      fetchTeams();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Teams" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Teams</h2>
              <button
                onClick={() => setIsAddingTeam(!isAddingTeam)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center"
              >
                {isAddingTeam ? "Cancel" : "New Team"}
              </button>
            </div>
            
            {/* Create Team Form - Collapsible */}
            {isAddingTeam && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Team</h3>
                <form onSubmit={handleCreateTeam}>
                  <div className="mb-4">
                    <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
                      Team Name
                    </label>
                    <input
                      id="teamName"
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="Enter team name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Members
                    </label>
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {users.map((u) => (
                          <div key={u.id} className="flex items-center p-2 hover:bg-gray-100 rounded">
                            <input
                              type="checkbox"
                              id={`user-${u.id}`}
                              checked={selectedUsers.includes(u.id)}
                              onChange={() => handleUserSelect(u.id)}
                              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`user-${u.id}`} className="text-gray-700 cursor-pointer">
                              {u.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      Create Team
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.length === 0 ? (
                <div className="col-span-full p-8 bg-white rounded-lg shadow-md text-center border border-gray-200">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 text-lg mb-4">No teams created yet</p>
                  <button
                    onClick={() => setIsAddingTeam(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  >
                    Create Your First Team
                  </button>
                </div>
              ) : (
                teams.map((team) => (
                  <div 
                    key={team.id} 
                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{team.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{team.member_ids?.length || 0} members</span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      {/* Team Member Management */}
                      <div className="mb-4 space-y-3">
                        <div className="flex space-x-2">
                          <div className="flex-1 relative">
                            <select
                              onChange={(e) => {
                                handleAddMember(team.id, parseInt(e.target.value));
                                e.target.value = "";
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg appearance-none pl-9 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              defaultValue=""
                            >
                              <option value="" disabled>Add Member</option>
                              {users
                                .filter((u) => !team.member_ids?.includes(u.id))
                                .map((u) => (
                                  <option key={u.id} value={u.id}>
                                    {u.name}
                                  </option>
                                ))}
                            </select>
                            <UserPlus className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                          </div>
                          
                          <div className="flex-1 relative">
                            <select
                              onChange={(e) => {
                                handleRemoveMember(team.id, parseInt(e.target.value));
                                e.target.value = "";
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg appearance-none pl-9 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              defaultValue=""
                            >
                              <option value="" disabled>Remove Member</option>
                              {users
                                .filter((u) => team.member_ids?.includes(u.id))
                                .map((u) => (
                                  <option key={u.id} value={u.id}>
                                    {u.name}
                                  </option>
                                ))}
                            </select>
                            <UserMinus className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Current Members List */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Current Members</h4>
                        <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-2">
                          {users
                            .filter((u) => team.member_ids?.includes(u.id))
                            .map((u) => (
                              <div key={u.id} className="flex items-center py-1 px-2 text-sm">
                                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 font-medium">
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-gray-800">{u.name}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link
                          to="/chat"
                          className="flex items-center justify-center w-full bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors duration-200"
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Go to Team Chat
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamPage;