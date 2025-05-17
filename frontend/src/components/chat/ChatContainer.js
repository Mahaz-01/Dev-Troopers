import React from 'react';
import ChatList from './ChatList';
import ChatInterface from './ChatInterface';

const ChatContainer = () => {
  return (
    <div className="flex flex-1 h-screen overflow-y-auto ">
      <ChatList />
      <ChatInterface />
    </div>
  );
};

export default ChatContainer;