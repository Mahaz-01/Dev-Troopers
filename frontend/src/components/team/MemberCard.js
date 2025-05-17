import React from 'react';

const MemberCard = ({ name, role }) => {
  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-gray-600">👤</span>
      </div>
      <div>
        <p className="text-gray-800 font-medium">{name}</p>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  );
};

export default MemberCard;