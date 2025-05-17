import React from 'react';

const ReminderList = ({ reminders }) => {
  return (
    <div className="p-6 bg-gray-50 flex-1 h-screen overflow-y-auto ">
      {reminders.map((reminder) => (
        <div key={reminder.id} className="flex items-start space-x-3 mb-4 border-b pb-4 last:border-b-0">
          <input type="checkbox" className="mt-1" defaultChecked={reminder.completed} />
          <div>
            <p className="text-gray-800 font-medium">{reminder.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReminderList;