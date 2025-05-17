import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { chatService } from '../services/chatService';
import { useAuth } from '../context/AuthContext.js'

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({
    receiver_id: '',
    content: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await chatService.getMessages();
        setMessages(response);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await chatService.sendMessage(newMessage);
      setMessages([...messages, response]);
      setNewMessage({ receiver_id: '', content: '' });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Chat" />
        <main className="flex-1 p-6 overflow-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Messages</h2>

          {/* Messages List */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 max-h-[60vh] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 p-3 rounded-lg ${
                  message.sender_id === user.id ? 'bg-blue-100 ml-auto' : 'bg-gray-100 mr-auto'
                } max-w-[70%]`}
              >
                <p className="text-sm text-gray-600">
                  {message.sender_id === user.id
                    ? 'You'
                    : message.sender_name}{' '}
                  to{' '}
                  {message.receiver_id === user.id
                    ? 'You'
                    : message.receiver_name}
                </p>
                <p>{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Send Message Form */}
          <form onSubmit={handleSendMessage} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Receiver (User ID)</label>
                <input
                  type="number"
                  value={newMessage.receiver_id}
                  onChange={(e) => setNewMessage({ ...newMessage, receiver_id: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Message</label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              Send Message
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;