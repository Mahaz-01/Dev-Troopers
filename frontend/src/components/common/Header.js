import React from 'react';
import { useAuth } from '../../context/AuthContext.js';
const Header = ({ title }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-4 w-full">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search People or Tasks"
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600">🔔</button>
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">syedsaf@gmail.com</span>
          <button className="text-gray-600">⬇️</button>
        </div>
      </div>
    </header>
  );
};

export default Header;