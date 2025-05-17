import React from 'react';

const TeamMembers = () => {
  const members = [
    { name: 'Seemab Khan', role: 'Supervisor' },
    { name: 'Taiha Usman', role: 'Team Lead' },
    { name: 'Syed Sofi Naqvi', role: 'Team Member' },
    { name: 'Wahaj Bukhari', role: 'Team Member' },
    { name: 'Ahmed Afraz', role: 'Technical Supervisor' },
  ];

  return (
    <div className="p-6 bg-gray-50 flex-1 h-screen overflow-y-auto ">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Members</h2>
      {members.map((member) => (
        <div key={member.name} className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600">👤</span>
          </div>
          <div>
            <p className="text-gray-800 font-medium">{member.name}</p>
            <p className="text-sm text-gray-600">{member.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamMembers;