import React from 'react';
import TaskStatistics from './TaskStatistics';
import ProjectStats from './ProjectStats';
import UpcomingMeetings from './UpcomingMeetings';

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50 flex-1 overflow-y-auto h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <TaskStatistics />
      </div>
      <ProjectStats />
      <UpcomingMeetings />
    </div>
  );
};

export default Dashboard;