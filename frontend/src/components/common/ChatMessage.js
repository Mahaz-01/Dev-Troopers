import React from 'react';

const ChatMessage = ({ message, isSent }) => {
  return (
    <div
      className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-xs p-3 rounded-lg shadow-sm ${isSent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
      >
        <p>{message.text}</p>
        <span className="text-xs text-gray-500 mt-1 block">{message.time}</span>
      </div>
    </div>
  );
};

export default ChatMessage;