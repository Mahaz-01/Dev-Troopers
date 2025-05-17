import React from 'react';
import { motion } from 'framer-motion';

const TaskCard = ({ title, count, progress }) => {
  return (
    <motion.div
      className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
      <p className="text-2xl font-semibold text-gray-800 mb-2">{count}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-500 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </motion.div>
  );
};

export default TaskCard;