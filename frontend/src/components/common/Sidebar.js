import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const sidebarVariants = {
    open: { width: '200px', transition: { duration: 0.3 } },
    closed: { width: '60px', transition: { duration: 0.3 } },
  };

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', path: '/' },
    { name: 'Tasks', icon: '📋', path: '/tasks' },
    { name: 'Chat', icon: '💬', path: '/chat' },
    { name: 'Reminders', icon: '⏰', path: '/reminders' },
    { name: 'Team', icon: '👥', path: '/team' },
    { name: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  return (
    <motion.div
      className="h-screen bg-white shadow-lg flex flex-col items-center py-4"
      variants={sidebarVariants}
      initial="open"
      animate={isOpen ? 'open' : 'closed'}
    >
      <div className="mb-8 flex justify-center w-full px-4">
        <button onClick={() => setIsOpen(!isOpen)} className="text-blue-600 text-2xl">
          {isOpen ? '⬅️' : '➡️'}
        </button>
      </div>
      <nav className="flex-1 w-full">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors duration-200"
          >
            <span className="text-xl mr-4">{item.icon}</span>
            {isOpen && <span className="text-gray-700">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;