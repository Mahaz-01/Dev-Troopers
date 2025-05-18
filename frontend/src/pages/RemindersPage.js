import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { reminderService } from '../services/reminderService';
import { useAuth } from '../context/AuthContext';

const RemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ title: '', description: '', due_date: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await reminderService.getReminders();
      setReminders(response);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    try {
      const reminderData = {
        ...newReminder,
        due_date: new Date(newReminder.due_date).toISOString()
      };
      await reminderService.createReminder(reminderData);
      setNewReminder({ title: '', description: '', due_date: '' });
      fetchReminders();
    } catch (error) {
      console.error('Error creating reminder:', error);
    }
  };

  const handleToggleComplete = async (id, is_completed) => {
    try {
      await reminderService.updateReminder(id, { is_completed: !is_completed });
      fetchReminders();
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await reminderService.deleteReminder(id);
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  // Group reminders by date
  const groupRemindersByDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const groups = {
      today: [],
      yesterday: [],
      other: []
    };

    reminders.forEach(reminder => {
      const reminderDate = new Date(reminder.due_date);
      const isToday = reminderDate.toDateString() === today.toDateString();
      const isYesterday = reminderDate.toDateString() === yesterday.toDateString();
      
      if (isToday) {
        groups.today.push(reminder);
      } else if (isYesterday) {
        groups.yesterday.push(reminder);
      } else {
        groups.other.push(reminder);
      }
    });

    return groups;
  };

  const groupedReminders = groupRemindersByDate();

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const ReminderItem = ({ reminder, showDate = false }) => (
    <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors duration-200 group">
      <div className="flex items-center space-x-3 flex-1">
        <button
          onClick={() => handleToggleComplete(reminder.id, reminder.is_completed)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            reminder.is_completed
              ? 'bg-blue-500 border-blue-500 text-white'
              : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          {reminder.is_completed && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${reminder.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {reminder.title}
          </div>
          {reminder.description && (
            <div className={`text-sm mt-1 ${reminder.is_completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {reminder.description}
            </div>
          )}
          {showDate && (
            <div className="text-xs text-gray-500 mt-1">
              {formatDate(reminder.due_date)} at {formatTime(reminder.due_date)}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!showDate && (
          <span className="text-xs text-gray-500">
            {formatTime(reminder.due_date)}
          </span>
        )}
        <button
          onClick={() => handleDeleteReminder(reminder.id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
            <circle cx="19" cy="12" r="1" fill="currentColor"/>
            <circle cx="5" cy="12" r="1" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Reminders" />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reminders</h1>
            <p className="text-gray-600">Stay on top of your important tasks and deadlines</p>
          </div>

          {/* Create Reminder Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Create New Reminder
              </h2>
            </div>
            <form onSubmit={handleCreateReminder} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    placeholder="Enter reminder title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={newReminder.due_date}
                    onChange={(e) => setNewReminder({ ...newReminder, due_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                    placeholder="Add a description (optional)..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                >
                  Add Reminder
                </button>
              </div>
            </form>
          </div>

          {/* Reminders List */}
          <div className="space-y-6">
            {/* Today Section */}
            {groupedReminders.today.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-blue-600">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Today
                    <span className="ml-auto bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      {groupedReminders.today.length}
                    </span>
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {groupedReminders.today.map((reminder) => (
                    <ReminderItem key={reminder.id} reminder={reminder} />
                  ))}
                </div>
              </div>
            )}

            {/* Yesterday Section */}
            {groupedReminders.yesterday.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-gray-600">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Yesterday
                    <span className="ml-auto bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                      {groupedReminders.yesterday.length}
                    </span>
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {groupedReminders.yesterday.map((reminder) => (
                    <ReminderItem key={reminder.id} reminder={reminder} />
                  ))}
                </div>
              </div>
            )}

            {/* Other Dates Section */}
            {groupedReminders.other.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-gray-600">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Other Dates
                    <span className="ml-auto bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                      {groupedReminders.other.length}
                    </span>
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {groupedReminders.other.map((reminder) => (
                    <ReminderItem key={reminder.id} reminder={reminder} showDate={true} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {reminders.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="2"/>
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="#6B7280" strokeWidth="2"/>
                    <line x1="12" y1="17" x2="12.01" y2="17" stroke="#6B7280" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders yet</h3>
                <p className="text-gray-500">Create your first reminder to stay organized!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RemindersPage;