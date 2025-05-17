import React from 'react';

const ReminderItem = ({ text, completed }) => {
  return (
    <div className="flex items-start space-x-3 mb-4 border-b pb-4 last:border-b-0">
      <input type="checkbox" className="mt-1" defaultChecked={completed} />
      <p className="text-gray-800 font-medium">{text}</p>
    </div>
  );
};

export default ReminderItem;