import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationsBell from '../components/NotificationsBell';
import { PawPrint, Plus, Calendar, MessageCircle, ShieldCheck, LogIn, UserPlus, LogOut, Home } from 'lucide-react';

export default function Header() {
  const auth = useAuth?.() ?? {};
  const user = auth.user ?? null;
  const logout = auth.logout ?? (() => {});
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 shadow-lg border-b-2 border-pink-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent hover:scale-105 transform transition-all duration-200"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <PawPrint className="text-white" size={22} />
          </div>
          Tales&Tails
        </Link>

        {/* Navigation */}
        <nav className="flex gap-2 items-center">
          {/* Browse Pets */}
          <Link 
            to="/pets" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white hover:shadow-md transform hover:scale-105 transition-all duration-200 font-semibold text-gray-700"
          >
            <Home size={18} />
            Browse
          </Link>

          {/* Add Pet (Owner only) */}
          {user && user.role === 'owner' && (
            <Link 
              to="/create-pet" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-teal-400 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
            >
              <Plus size={18} />
              Add Pet
            </Link>
          )}

          {/* Bookings */}
          {user && (
            <Link 
              to="/bookings" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white hover:shadow-md transform hover:scale-105 transition-all duration-200 font-semibold text-gray-700"
            >
              <Calendar size={18} />
              Bookings
            </Link>
          )}

          {/* Chat */}
          {user && (
            <Link 
              to="/chat" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white hover:shadow-md transform hover:scale-105 transition-all duration-200 font-semibold text-gray-700"
            >
              <MessageCircle size={18} />
              Chat
            </Link>
          )}

          {/* Notifications Bell */}
          {user && (
            <div className="relative">
              <NotificationsBell />
            </div>
          )}

          {/* Admin (Admin only) */}
          {user && user.role === 'admin' && (
            <Link 
              to="/admin" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
            >
              <ShieldCheck size={18} />
              Admin
            </Link>
          )}

          {/* Auth Buttons */}
          {!user ? (
            <div className="flex gap-2 ml-2">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                <LogIn size={18} />
                Login
              </Link>
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-purple-400 text-purple-600 hover:bg-white hover:shadow-md transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                <UserPlus size={18} />
                Register
              </Link>
            </div>
          ) : (
            <div className="flex gap-2 items-center ml-2">
              <div className="px-4 py-2 bg-white rounded-full shadow-md border-2 border-pink-200">
                <span className="font-semibold text-gray-700">Hi, </span>
                <span className="font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {user.name}
                </span>
              </div>
              <button 
                onClick={handleLogout} 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:shadow-md transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}