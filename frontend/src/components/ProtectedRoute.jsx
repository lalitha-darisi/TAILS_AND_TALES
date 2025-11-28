import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldX, Home, Lock, PawPrint } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const [showDenied, setShowDenied] = useState(false);

  useEffect(() => {
    // Show access denied message briefly before redirecting
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      setShowDenied(true);
      const timer = setTimeout(() => {
        setShowDenied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, allowedRoles]);

  // Not logged in - redirect to login
  if (!user) return <Navigate to="/login" />;

  // Access denied - show message then redirect
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (showDenied) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
          {/* Floating Paw Prints Background */}
          <div className="absolute top-10 left-10 text-orange-300 opacity-20 animate-bounce">
            <PawPrint size={60} />
          </div>
          <div className="absolute top-20 right-20 text-pink-300 opacity-20 animate-bounce" style={{ animationDelay: '150ms' }}>
            <PawPrint size={45} />
          </div>
          <div className="absolute bottom-20 left-1/4 text-purple-300 opacity-15 animate-bounce" style={{ animationDelay: '300ms' }}>
            <PawPrint size={50} />
          </div>
          <div className="absolute bottom-32 right-1/3 text-pink-300 opacity-20 animate-bounce" style={{ animationDelay: '450ms' }}>
            <PawPrint size={40} />
          </div>

          {/* Access Denied Card */}
          <div className="max-w-md mx-auto px-6 relative z-10">
            <div className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-red-200 text-center">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <ShieldX className="text-white" size={48} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <Lock className="text-white" size={20} />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Access Denied
              </h1>

              {/* Message */}
              <p className="text-lg text-gray-700 mb-6">
                Oops! You don't have permission to access this page.
              </p>

              {/* Divider */}
              <div className="h-1 bg-gradient-to-r from-red-300 via-pink-300 to-purple-300 rounded-full mb-6"></div>

              {/* Info */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4 mb-6 border-2 border-red-200">
                <p className="text-sm text-gray-600">
                  This area is restricted to specific roles. 
                  <br />
                  Redirecting you to the home page...
                </p>
              </div>

              {/* Loading Indicator */}
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <Navigate to="/" />;
  }

  // All checks passed - render protected content
  return children;
}