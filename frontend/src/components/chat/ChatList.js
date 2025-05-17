import React from 'react';

const ChatList = () => {
  const chats = [
    { name: 'AI Projects', lastMessage: 'Hey', time: '1min' },
    { name: 'Estimated proj. timeline', lastMessage: 'Wassup ?', time: '1min' },
    { name: 'Previous SE projects', lastMessage: 'Hey', time: '1min' },
    { name: 'Dev ops previous proj.', lastMessage: 'Hey', time: '1hr' },
  ];

  return (
    <div className="w-1/4 bg-white p-4 shadow-sm">
      <input
        type="text"
        placeholder="Search Chats"
        className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {chats.map((chat) => (
        <div key={chat.name} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600">🤖</span>
          </div>
          <div>
            <p className="text-gray-800 font-medium">{chat.name}</p>
            <p className="text-sm text-gray-600">{chat.lastMessage}</p>
            <span className="text-xs text-gray-500">{chat.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;