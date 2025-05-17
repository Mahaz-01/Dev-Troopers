import React from 'react';

const UpcomingMeetings = () => {
  const meetings = [
    { name: 'Dev Trooper', role: 'Team Meeting', time: '10:30 AM' },
    { name: 'Seemab Khan', role: 'Supervisor', time: '11:00 AM' },
    { name: 'Wahaj Bukhari', role: 'Supervisor', time: '02:00 PM' },
  ];

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm w-1/3 absolute right-6 top-1/3">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Meetings</h2>
      {meetings.map((meeting) => (
        <div key={meeting.name} className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600">👤</span>
            </div>
            <div>
              <p className="text-gray-800 font-medium">{meeting.name}</p>
              <p className="text-sm text-gray-600">{meeting.role}</p>
            </div>
          </div>
          <button className="bg-blue-500 text-white px-4 py-1 rounded-lg">{meeting.time}</button>
        </div>
      ))}
    </div>
  );
};

export default UpcomingMeetings;