import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProjectStats = () => {
  const data = [
    { name: 'Feb', value: 30 },
    { name: 'Mar', value: 50 },
    { name: 'Apr', value: 85 },
    { name: 'May', value: 60 },
    { name: 'June', value: 72 },
    { name: 'July', value: 35 },
    { name: 'Aug', value: 12 },
    { name: 'Sept', value: 95 },
    { name: 'Oct', value: 85 },
    { name: 'Nov', value: 65 },
  ];

  return (
    <div className="w-full bg-white p-6">
      <h2 className="text-xl font-medium text-gray-700 mb-6 text-center">Project Statistics</h2>
      <div className="mb-2">
        <span className="text-sm text-gray-600">Unit: Percent</span>
        <div className="text-xs text-gray-500">100</div>
      </div>
      <AreaChart width={800} height={300} data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#bfdbfe" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="none" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fill="url(#colorBlue)"
          />
        </AreaChart>
      <div className="flex justify-center mt-4">
        <div className="flex items-center">
          <div className="w-3 h-2 bg-blue-500 mr-2"></div>
          <span className="text-sm text-blue-600">Tasks Completed</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectStats;