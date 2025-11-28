import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckCheck, X } from 'lucide-react';

export default function NotificationsBell() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      const [{ data: { count } }, { data: items }] = await Promise.all([
        api.get('/notifications/unread-count'),
        api.get('/notifications')
      ]);
      setCount(count);
      setItems(items.slice(0, 8)); // show recent 8
    } catch (err) {
      console.warn('notif load', err?.response?.data || err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/mark-read/${id}`);
      await load();
    } catch (err) { console.warn(err); }
  };

  const markAll = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      await load();
    } catch (err) { console.warn(err); }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button 
        onClick={() => { setOpen(!open); if (!open) load(); }} 
        aria-label="Notifications"
        className="relative p-2 rounded-full hover:bg-white hover:shadow-md transform hover:scale-110 transition-all duration-200"
      >
        <Bell 
          size={22} 
          className={`${count > 0 ? 'text-pink-600 animate-pulse' : 'text-gray-600'}`}
        />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce">
            {count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border-2 border-pink-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-3 border-b-2 border-pink-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bell size={20} className="text-pink-600" />
                  <span className="font-bold text-lg text-gray-800">Notifications</span>
                  {count > 0 && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full">
                      {count} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {count > 0 && (
                    <button 
                      onClick={markAll}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-400 to-teal-400 text-white text-xs font-semibold rounded-full hover:shadow-md transform hover:scale-105 transition-all duration-200"
                    >
                      <CheckCheck size={14} />
                      Mark all
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 rounded-full hover:bg-pink-100 transition-colors"
                  >
                    <X size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 && (
                <div className="text-center py-12 px-4">
                  <Bell size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No notifications yet</p>
                  <p className="text-gray-400 text-sm mt-1">We'll let you know when something arrives!</p>
                </div>
              )}
              
              {items.map((n, idx) => (
                <div 
                  key={n._id} 
                  className={`p-4 border-b border-gray-100 transition-all duration-200 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 ${
                    !n.read ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread Indicator */}
                    {!n.read && (
                      <div className="w-2 h-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full mt-2 flex-shrink-0 animate-pulse" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h4 className={`font-bold text-gray-800 mb-1 ${!n.read ? 'text-purple-900' : ''}`}>
                        {n.title}
                      </h4>
                      
                      {/* Body */}
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {n.body}
                      </p>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <small className="text-xs text-gray-500">
                          {new Date(n.createdAt).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                        
                        {!n.read && (
                          <button 
                            onClick={() => markRead(n._id)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-white border-2 border-green-300 text-green-600 text-xs font-semibold rounded-full hover:bg-green-50 hover:shadow-md transform hover:scale-105 transition-all duration-200"
                          >
                            <Check size={12} />
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-3 border-t-2 border-pink-200 text-center">
              <Link 
                to="/notifications" 
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                View All Notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}