import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => setTasks([...tasks, task]);
  const updateTask = (updatedTask) => setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  const deleteTask = (taskId) => setTasks(tasks.filter(t => t.id !== taskId));

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);