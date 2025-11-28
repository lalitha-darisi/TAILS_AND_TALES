import React, { useState } from 'react';
import { Home, Bell, PawPrint, CheckCircle, AlertCircle, Heart, Calendar, MessageCircle, Clock } from 'lucide-react';

export default function NotificationsPage() {
  // Mock notifications data
  const mockNotifications = [
    {
      _id: 'notif1',
      title: 'Booking Approved! 🎉',
      body: 'Your booking for Luna has been approved! The seller will contact you soon to schedule a visit.',
      createdAt: '2024-03-15T10:30:00Z',
      read: false,
      type: 'booking'
    },
    {
      _id: 'notif2',
      title: 'New Message',
      body: 'Sarah Johnson sent you a message about Max. Click to view the conversation.',
      createdAt: '2024-03-15T09:15:00Z',
      read: false,
      type: 'message'
    },
    {
      _id: 'notif3',
      title: 'Payment Successful ✓',
      body: 'Your payment of $350 for Luna has been processed successfully. Welcome to the family!',
      createdAt: '2024-03-14T16:45:00Z',
      read: true,
      type: 'payment'
    },
    {
      _id: 'notif4',
      title: 'Reminder: Vet Appointment',
      body: 'Don\'t forget! Bella has a vet appointment scheduled for tomorrow at 2:00 PM.',
      createdAt: '2024-03-14T08:00:00Z',
      read: true,
      type: 'reminder'
    },
    {
      _id: 'notif5',
      title: 'New Pet Listed',
      body: 'A new Golden Retriever puppy matching your preferences has been listed. Check it out!',
      createdAt: '2024-03-13T14:20:00Z',
      read: true,
      type: 'pet'
    }
  ];

  const [items] = useState(mockNotifications);

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'booking': return <Calendar className="text-white" size={20} />;
      case 'message': return <MessageCircle className="text-white" size={20} />;
      case 'payment': return <CheckCircle className="text-white" size={20} />;
      case 'reminder': return <Bell className="text-white" size={20} />;
      case 'pet': return <Heart className="text-white" size={20} />;
      default: return <AlertCircle className="text-white" size={20} />;
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'booking': return 'from-purple-400 to-purple-500';
      case 'message': return 'from-blue-400 to-blue-500';
      case 'payment': return 'from-green-400 to-green-500';
      case 'reminder': return 'from-yellow-400 to-yellow-500';
      case 'pet': return 'from-pink-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Floating Paw Prints */}
      <div className="absolute top-10 left-10 text-orange-300 opacity-30 animate-bounce">
        <PawPrint size={40} />
      </div>
      <div className="absolute top-20 right-20 text-pink-300 opacity-30 animate-bounce" style={{ animationDelay: '150ms' }}>
        <PawPrint size={30} />
      </div>
      <div className="absolute bottom-20 right-1/4 text-purple-300 opacity-20 animate-bounce" style={{ animationDelay: '300ms' }}>
        <PawPrint size={35} />
      </div>
      
      {/* Home Button */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-pink-600 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-pink-200"
        >
          <Home size={20} />
          Home
        </button>
      </div>

      {/* Page Header */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="relative">
              <Bell className="text-purple-600" size={40} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Notifications
            </h2>
            <PawPrint className="text-orange-600" size={40} />
          </div>
          <p className="text-lg text-gray-600">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up! 🎉'}
          </p>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg border-2 border-purple-100">
              <Bell className="mx-auto text-gray-300 mb-4" size={80} />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No notifications yet</h3>
              <p className="text-gray-500">
                When you receive notifications, they'll appear here
              </p>
            </div>
          ) : (
            items.map(n => (
              <div
                key={n._id}
                className={`bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 transform hover:scale-[1.02] ${
                  n.read ? 'border-gray-200' : 'border-purple-300 bg-gradient-to-br from-white to-purple-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${getNotificationColor(n.type)} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    {getNotificationIcon(n.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {n.title}
                      </h3>
                      {!n.read && (
                        <span className="flex-shrink-0 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {n.body}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={14} />
                      {new Date(n.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Banner */}
        {items.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-8 shadow-2xl text-white text-center">
            <h3 className="text-3xl font-bold mb-2">🔔 Stay Updated</h3>
            <p className="text-lg opacity-90">
              Never miss important updates about your pet adoption journey!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}