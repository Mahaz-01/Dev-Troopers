import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { chatService } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { api } from '../services/api';

const ChatPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newChatRoomName, setNewChatRoomName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const socket = useSocket();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all users for chat room creation
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch chat rooms
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await chatService.getChatRooms();
        setChatRooms(response);
        if (response.length > 0 && !selectedRoom) {
          setSelectedRoom(response[0]);
        }
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    };
    fetchChatRooms();
  }, []);

  // Fetch messages for the selected chat room
  useEffect(() => {
    if (selectedRoom) {
      const fetchMessages = async () => {
        try {
          const response = await chatService.getMessages(selectedRoom.id);
          setMessages(response);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [selectedRoom]);

  // Listen for new messages via Socket.io
  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        if (message.chat_room_id === selectedRoom?.id) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });

      socket.on('userOnline', (userId) => {
        setOnlineUsers(prev => new Set([...prev, userId]));
      });

      socket.on('userOffline', (userId) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      });

      return () => {
        socket.off('newMessage');
        socket.off('userOnline');
        socket.off('userOffline');
      };
    }
  }, [socket, selectedRoom]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      await chatService.sendMessage({
        chat_room_id: selectedRoom.id,
        content: newMessage
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateChatRoom = async (e) => {
    e.preventDefault();
    if (!newChatRoomName.trim()) return;

    try {
      const chatRoomData = {
        name: newChatRoomName,
        userIds: selectedUsers
      };
      const newRoom = await chatService.createChatRoom(chatRoomData);
      setChatRooms([...chatRooms, newRoom]);
      setNewChatRoomName('');
      setSelectedUsers([]);
      setShowCreateRoom(false);
      socket.emit('joinRooms', user.id);
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const getLastMessage = (room) => {
    // Assuming you have a lastMessage field or can derive it
    return room.lastMessage || 'No messages yet';
  };

  const generateUserColor = (userId) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500',
      'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-gray-500'
    ];
    return colors[userId % colors.length];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Team Chat" />
        <main className="flex-1 flex overflow-hidden">
          {/* Chat Rooms Sidebar */}
          <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
            {/* Header with create button */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Chat Rooms</h3>
                <button
                  onClick={() => setShowCreateRoom(!showCreateRoom)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-all duration-200"
                  title="Create new chat room"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Create Chat Room Form */}
            {showCreateRoom && (
              <div className="p-4 bg-gray-50 border-b border-gray-200 animate-in slide-in-from-top duration-200">
                <form onSubmit={handleCreateChatRoom} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={newChatRoomName}
                      onChange={(e) => setNewChatRoomName(e.target.value)}
                      placeholder="Chat room name"
                      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Select participants:</p>
                    <div className="space-y-2">
                      {users.map((u) => (
                        <label key={u.id} className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(u.id)}
                            onChange={() => handleUserSelect(u.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                          />
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full ${generateUserColor(u.id)} flex items-center justify-center text-white text-sm font-semibold mr-3`}>
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-700">{u.name}</span>
                            {onlineUsers.has(u.id) && (
                              <div className="w-2 h-2 bg-green-400 rounded-full ml-2"></div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateRoom(false)}
                      className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Chat Rooms List */}
            <div className="flex-1 overflow-y-auto">
              {chatRooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No chat rooms yet</p>
                  <p className="text-gray-400 text-sm mt-2">Create your first chat room to get started</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {chatRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`p-3 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-98 ${
                        selectedRoom?.id === room.id
                          ? 'bg-blue-50 border-2 border-blue-200 shadow-md'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full ${generateUserColor(room.id)} flex items-center justify-center shadow-sm`}>
                            <span className="text-lg font-bold text-white">
                              {room.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {selectedRoom?.id === room.id && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 truncate">{room.name}</h4>
                            <span className="text-xs text-gray-500">12:30 PM</span>
                          </div>
                          <p className="text-sm text-gray-500 truncate mt-1">{getLastMessage(room)}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {room.members.length} member{room.members.length !== 1 ? 's' : ''}
                            </span>
                            {selectedRoom?.id !== room.id && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            {selectedRoom ? (
              <>
                {/* Chat Header */}
                <div className="bg-white shadow-sm p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${generateUserColor(selectedRoom.id)} flex items-center justify-center mr-4`}>
                        <span className="text-lg font-bold text-white">
                          {selectedRoom.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{selectedRoom.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                          {selectedRoom.members.filter(member => onlineUsers.has(member.id)).length} online • {selectedRoom.members.length} total
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100">
                  <div className="p-6 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages yet</h3>
                        <p className="text-gray-500">Be the first to send a message in this room!</p>
                      </div>
                    ) : (
                      messages.map((message, index) => {
                        const isOwn = message.sender_id === user.id;
                        const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;
                        
                        return (
                          <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-end max-w-xs lg:max-w-md xl:max-w-lg ${isOwn ? 'flex-row-reverse' : ''}`}>
                              {/* Avatar */}
                              {showAvatar ? (
                                <div className={`w-8 h-8 rounded-full ${generateUserColor(message.sender_id)} flex items-center justify-center text-white text-sm font-semibold ${isOwn ? 'ml-2' : 'mr-2'}`}>
                                  {(isOwn ? 'You' : message.sender_name)?.charAt(0).toUpperCase()}
                                </div>
                              ) : (
                                <div className={`w-8 ${isOwn ? 'ml-2' : 'mr-2'}`}></div>
                              )}
                              
                              {/* Message bubble */}
                              <div className={`group relative`}>
                                {showAvatar && (
                                  <p className={`text-xs text-gray-500 mb-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                                    {isOwn ? 'You' : message.sender_name}
                                  </p>
                                )}
                                <div className={`relative p-3 rounded-2xl shadow-sm ${
                                  isOwn
                                    ? 'bg-blue-500 text-white rounded-br-md'
                                    : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                                } transition-all hover:shadow-md`}>
                                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                                  <div className={`flex items-center justify-end mt-1 space-x-1 ${
                                    isOwn ? 'text-blue-100' : 'text-gray-500'
                                  }`}>
                                    <span className="text-xs">
                                      {new Date(message.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                    {isOwn && (
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Typing indicator */}
                {isTyping && (
                  <div className="px-6 py-2">
                    <div className="flex items-center text-gray-500 text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="ml-2">Someone is typing...</span>
                    </div>
                  </div>
                )}

                {/* Send Message Form */}
                <div className="bg-white p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        className="w-full p-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all max-h-32 min-h-12"
                        placeholder="Type your message... (Press Enter to send)"
                        rows="1"
                        style={{ 
                          height: 'auto',
                          minHeight: '3rem'
                        }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                      />
                      <button
                        type="button"
                        className="absolute right-2 bottom-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Add emoji"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className={`p-3 rounded-2xl transition-all duration-200 ${
                        newMessage.trim()
                          ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:scale-105'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-3">Welcome to Team Chat</h2>
                  <p className="text-gray-500 text-lg mb-6">Select a chat room from the sidebar to start conversations</p>
                  <p className="text-gray-400 text-sm">💬 Real-time messaging • 👥 Team collaboration • 🔔 Instant notifications</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;