import React from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import ReminderList from '../components/reminders/ReminderList';

const RemindersPage = () => {
  const reminders = [
    { id: 1, text: 'Meeting with technical supervisor today', completed: false },
    { id: 2, text: 'Progress reporting to supervisor', completed: false },
    { id: 3, text: 'Team meeting tomorrow', completed: false },
    { id: 4, text: 'FYP - mid evaluation next monday', completed: false },
    { id: 5, text: 'FYP - defence next month', completed: false },
    { id: 6, text: 'FYP chapters 3 and 4 to complete this week', completed: false },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Team Dev Trooper" />
        <ReminderList reminders={reminders} />
      </div>
    </div>
  );
};

export default RemindersPage;