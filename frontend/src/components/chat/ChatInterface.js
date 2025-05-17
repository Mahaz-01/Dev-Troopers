import React from 'react';
import ChatMessage from '../common/ChatMessage';

const ChatInterface = () => {
  const messages = [
    { text: 'Hi Safi!', time: '24 Oct 2024', isSent: false },
    { text: 'Wassup ?', time: '24 Oct 2024', isSent: true },
    { text: 'Got the task list ?', time: '24 Oct 2024', isSent: true },
    { text: 'Hello', time: '24 Oct 2024', isSent: false },
    { text: 'All good :) Yeah, got the notification', time: '24 Oct 2024', isSent: false },
    { text: 'Wanted to ask about the AI projects', time: '24 Oct 2024', isSent: true },
    { text: 'I’d love to help you', time: '24 Oct 2024', isSent: false },
    { text: 'Can you please provide me a little more detail ?', time: '24 Oct 2024', isSent: true },
    { text: 'Sure', time: '24 Oct 2024', isSent: false },
    { text: 'I am willing to create my FYP in AI domain', time: '24 Oct 2024', isSent: false },
    { text: 'Great !', time: '24 Oct 2024', isSent: true },
    { text: 'All is fun, I think I can help you with some ideas', time: '24 Oct 2024', isSent: true },
    { text: 'Go for it', time: '24 Oct 2024', isSent: false },
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50 flex flex-col justify-between">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} isSent={msg.isSent} />
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">➡️</button>
      </div>
    </div>
  );
};

export default ChatInterface;