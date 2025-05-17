import React from 'react';
import TaskCard from '../common/TaskCard';

const TaskStatistics = () => {
  const stats = [
    { title: 'New Tasks', count: '05', progress: 30 },
    { title: 'Total Tasks', count: '15', progress: 70 },
    { title: 'In Progress', count: '03', progress: 20 },
    { title: 'Pending Tasks', count: '10', progress: 50 },
    { title: 'Completed', count: '02', progress: 10 },
  ];

  return (
    <>
      {stats.map((stat) => (
        <TaskCard
          key={stat.title}
          title={stat.title}
          count={stat.count}
          progress={stat.progress}
        />
      ))}
    </>
  );
};

export default TaskStatistics;