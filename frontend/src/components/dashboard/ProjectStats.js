import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ProjectStats = () => {
  const data = [
    { name: 'Feb', TasksCompleted: 20 },
    { name: 'Mar', TasksCompleted: 40 },
    { name: 'Apr', TasksCompleted: 90 },
    { name: 'May', TasksCompleted: 50 },
    { name: 'June', TasksCompleted: 70 },
    { name: 'July', TasksCompleted: 30 },
    { name: 'Aug', TasksCompleted: 10 },
    { name: 'Sept', TasksCompleted: 20 },
    { name: 'Oct', TasksCompleted: 50 },
    { name: 'Nov', TasksCompleted: 30 },
  ];

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Statistics</h2>
      <LineChart width={800} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="TasksCompleted" stroke="#3b82f6" fill="#bfdbfe" />
      </LineChart>
    </div>
  );
};

export default ProjectStats;