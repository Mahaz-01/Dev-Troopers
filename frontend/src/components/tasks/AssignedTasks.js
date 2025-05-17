import React from 'react';
import TaskList from './TaskList';

const AssignedTasks = () => {
  const tasks = [
    { id: 1, title: 'Enlist all of the functional requirements needed for the FYP', assignee: 'Taiha Usman', completed: false },
    { id: 2, title: 'Enlist all of the non functional requirements needed for the FYP', assignee: 'Taiha Usman', completed: false },
    { id: 3, title: 'Complete the documentation and review it', assignee: 'Taiha Usman', completed: true },
    { id: 4, title: 'Create diagrams i.e class diagram, workflow diagram, domain model, ERO, system sequence diagram', assignee: 'Wahaj Bukhari', completed: false },
    { id: 5, title: 'Analyse and create a workflow for the FYP', assignee: 'Wahaj Bukhari', completed: false },
    { id: 6, title: 'Create a detailed questionnaire for the survey', assignee: 'Syed Sofi Naqvi', completed: false },
    { id: 7, title: 'Create a logo for the FYP', assignee: 'Syed Sofi Naqvi', completed: false },
  ];

  return (
    <div className="p-6 bg-gray-50 flex-1 h-screen overflow-y-auto ">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Assigned Tasks</h2>
      <TaskList tasks={tasks} />
    </div>
  );
};

export default AssignedTasks;