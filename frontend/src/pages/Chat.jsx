import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import { Home, MessageCircle, PawPrint, Send, Search, User, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function Chat() {
  const { user, token } = useAuth();
  const [connected, setConnected] = useState(false);
  const [toUser, setToUser] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [text, setText] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const socketRef = useRef(null);
  const currentUserId = user?._id || user?.id;

  // Simple search placeholder (you can replace with an API call)
  const mockSearchResults = [
    { _id: 'user456', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'buyer' },
    { _id: 'user789', name: 'John Smith', email: 'john@example.com', role: 'seller' },
    { _id: 'user012', name: 'Emily Davis', email: 'emily@example.com', role: 'buyer' }
  ];

  useEffect(() => {
    // connect socket when we have a token
    if (!token) return;

    const BACKEND_ORIGIN = import.meta.env.VITE_API_URL
      ? new URL(import.meta.env.VITE_API_URL).origin
      : 'http://localhost:5000';

    const socket = io(BACKEND_ORIGIN, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setStatusMsg('');
    });

    socket.on('connect_error', (err) => {
      setConnected(false);
      setStatusMsg(err?.message || 'Socket connect error');
    });

    socket.on('receive_message', (msg) => {
      // Add incoming message to list if relevant
      setMessages(prev => {
        // avoid duplicates by id
        if (prev.some(m => String(m._id || m.id) === String(msg._id || msg.id))) return prev;
        return [...prev, msg];
      });
    });

    socket.on('chat_error', (err) => {
      setStatusMsg(err?.message || 'Chat error');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { data } = await api.get('/users/search', { params: { q: value } });
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('User search failed', err?.response?.data || err.message);
      setSearchResults([]);
      setStatusMsg('Failed to search users');
    }
  };

  const selectUser = async (userObj) => {
    setToUser(userObj._id);
    setSelectedUserName(userObj.name);
    setSearchResults([]);
    setSearchQuery('');

    // Fetch conversation from backend
    try {
      const currentUserId = user?._id || user?.id;
      const { data } = await api.get('/chats/conversation', { params: { userId: currentUserId, otherId: userObj._id } });
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load conversation', err?.response?.data || err.message);
      setMessages([]);
    }
  };

  const sendMessage = () => {
    if (!text.trim() || !toUser || !socketRef.current) return;

    const tempId = `tmp-${Date.now()}`;
    const newMsg = {
      _id: tempId,
      from: user?._id || user?.id,
      to: toUser,
      message: text,
      createdAt: new Date().toISOString(),
      pending: true
    };

    setMessages(prev => [...prev, newMsg]);
    setText('');

    socketRef.current.emit('send_message', { to: toUser, message: newMsg.message }, (ack) => {
      if (!ack) return;
      if (ack.ok && ack.data) {
        // If server already emitted the saved message (receive_message), avoid duplicating:
        setMessages(prev => {
          const savedId = String(ack.data._id || ack.data.id);
          const hasSaved = prev.some(m => String(m._id || m.id) === savedId);
          if (hasSaved) {
            // remove the temporary message only
            return prev.filter(m => String(m._id) !== String(tempId));
          }
          // otherwise replace temp message with saved doc
          return prev.map(m => (String(m._id) === String(tempId) ? ack.data : m));
        });
      } else {
        // mark failed
        setMessages(prev => prev.map(m => (m._id === tempId ? { ...m, pending: false, failed: true } : m)));
        setStatusMsg(ack?.message || 'Failed to send');
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Floating Paw Prints */}
      <div className="absolute top-10 left-10 text-orange-300 opacity-30 animate-bounce">
        <PawPrint size={40} />
      </div>
      <div className="absolute top-20 right-20 text-pink-300 opacity-30 animate-bounce" style={{ animationDelay: '150ms' }}>
        <PawPrint size={30} />
      </div>
      
      {/* Home Button */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-pink-600 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-pink-200"
        >
          <Home size={20} />
          Home
        </Link>
      </div>

      {/* Page Header */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <MessageCircle className="text-purple-600" size={40} />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Messages
            </h2>
            {connected ? (
              <CheckCircle className="text-green-600" size={40} />
            ) : (
              <AlertCircle className="text-red-600" size={40} />
            )}
          </div>
          <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
            {connected ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Connected
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Disconnected
              </>
            )}
          </p>
        </div>

        {/* Main Chat Container */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 overflow-hidden">
          {/* User Search Section */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-2 border-transparent focus:border-purple-300 focus:outline-none shadow-lg text-gray-800 placeholder-gray-400"
              />
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-purple-200 max-h-64 overflow-y-auto z-10">
                  {searchResults.map(u => (
                    <div
                      key={u._id}
                      onClick={() => selectUser(u)}
                      className="p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                          <User className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{u.name}</div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </div>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {u.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected User Display */}
            {toUser && (
              <div className="mt-4 flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                <User size={18} />
                <span className="font-semibold">Chatting with: {selectedUserName}</span>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <MessageCircle size={64} className="mb-4 opacity-50" />
                <p className="text-lg font-semibold">No messages yet</p>
                <p className="text-sm">Search and select a user to start chatting</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(m => {
                  const isOwn = String(m.from) === String(currentUserId);
                  return (
                    <div key={m._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                        <div className={`rounded-2xl px-4 py-3 shadow-md ${
                          isOwn 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                            : 'bg-white text-gray-800 border-2 border-purple-100'
                        }`}>
                          <p className="break-words">{m.message}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <Clock size={12} />
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {m.pending && <span className="ml-1 text-yellow-600">(sending...)</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Message Input Area */}
          <div className="p-6 bg-white border-t-2 border-purple-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={toUser ? "Type a message..." : "Select a user first..."}
                disabled={!toUser || !connected}
                className="flex-1 px-4 py-3 bg-gray-50 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={sendMessage}
                disabled={!text.trim() || !toUser || !connected}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                <Send size={20} />
                Send
              </button>
            </div>
            
            {/* Status Message */}
            {statusMsg && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                {statusMsg}
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-8 shadow-2xl text-white text-center">
          <h3 className="text-3xl font-bold mb-2">💬 Connect with Pet Lovers</h3>
          <p className="text-lg opacity-90">
            Chat with potential adopters or sellers to find the perfect match for your furry friends!
          </p>
        </div>
      </div>
    </div>
  );
}