import React from 'react';

const TaskList = ({ tasks }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex-1 h-screen overflow-y-auto ">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-start space-x-3 mb-4 border-b pb-4 last:border-b-0 ">
          <input type="checkbox" className="mt-1" defaultChecked={task.completed} />
          <div>
            <p className="text-gray-800 font-medium">{task.title}</p>
            <p className="text-sm text-gray-600">{task.assignee}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;