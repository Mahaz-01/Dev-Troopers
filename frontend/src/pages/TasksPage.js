import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { taskService } from '../services/taskService';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    assigned_to: ''
  });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskService.getTasks();
        setTasks(response);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await taskService.createTask(newTask);
      setTasks([...tasks, response]);
      setNewTask({ title: '', description: '', status: 'To Do', priority: 'Medium', assigned_to: '' });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (id) => {
    try {
      const response = await taskService.updateTask(id, editingTask);
      setTasks(tasks.map((task) => (task.id === id ? response : task)));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Tasks" />
        <main className="flex-1 p-6 overflow-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Tasks</h2>

          {/* Create Task Form */}
          <form onSubmit={handleCreateTask} className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700">Status</label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Assigned To (User ID)</label>
                <input
                  type="number"
                  value={newTask.assigned_to}
                  onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              Create Task
            </button>
          </form>

          {/* Tasks List */}
          <div className="bg-white rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{task.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{task.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{task.priority}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{task.assigned_to}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-blue-500 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Task Modal */}
          {editingTask && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Edit Task</h3>
                <div className="mb-4">
                  <label className="block text-gray-700">Title</label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    value={editingTask.description || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Status</label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Priority</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Assigned To (User ID)</label>
                  <input
                    type="number"
                    value={editingTask.assigned_to}
                    onChange={(e) => setEditingTask({ ...editingTask, assigned_to: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingTask(null)}
                    className="bg-gray-300 text-gray-700 p-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateTask(editingTask.id)}
                    className="bg-blue-500 text-white p-2 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TasksPage;