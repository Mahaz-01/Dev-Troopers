import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => setMessages([...messages, message]);

  return (
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);