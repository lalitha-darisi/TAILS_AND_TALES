import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, PawPrint, Users, Calendar, Heart, Star, TrendingUp, BarChart3 } from 'lucide-react';
import api from '../api/api';

export default function AdminDashboard(){
  const [data, setData] = useState(null);
  
  useEffect(() => { 
    api.get('/admin/analytics')
      .then(r => setData(r.data))
      .catch(console.warn); 
  }, []);
  
  if (!data) return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <BarChart3 className="animate-bounce text-purple-500 mx-auto mb-4" size={48} />
        <p className="text-xl text-gray-700">Loading analytics...</p>
      </div>
    </div>
  );
  
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <BarChart3 className="text-purple-600" size={40} />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Admin Analytics
            </h2>
            <TrendingUp className="text-orange-600" size={40} />
          </div>
          <p className="text-lg text-gray-600">Overview of your PetAdopt platform</p>
        </div>

        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Pets Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-100 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                <PawPrint className="text-white" size={32} />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Pets</p>
                <p className="text-4xl font-bold text-gray-800 mt-1">{data.totalPets}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"></div>
          </div>

          {/* Total Users Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-pink-100 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-pink-400 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="text-white" size={32} />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Users</p>
                <p className="text-4xl font-bold text-gray-800 mt-1">{data.totalUsers}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full"></div>
          </div>

          {/* Total Bookings Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-400 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="text-white" size={32} />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Bookings</p>
                <p className="text-4xl font-bold text-gray-800 mt-1">{data.totalBookings}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full"></div>
          </div>

          {/* Adopted Pets Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-green-100 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-green-400 to-green-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="text-white fill-white" size={32} />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Adopted Pets</p>
                <p className="text-4xl font-bold text-gray-800 mt-1">{data.adopted}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
          </div>

          {/* Average Rating Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-yellow-100 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="text-white fill-white" size={32} />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Avg Rating</p>
                <p className="text-4xl font-bold text-gray-800 mt-1">
                  {data.avgRating?.toFixed(2) || 'N/A'}
                </p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
          </div>

          {/* Success Rate Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="text-white" size={32} />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Success Rate</p>
                <p className="text-4xl font-bold text-gray-800 mt-1">
                  {data.totalPets > 0 
                    ? ((data.adopted / data.totalPets) * 100).toFixed(0) 
                    : 0}%
                </p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Summary Banner */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-8 shadow-2xl text-white text-center">
          <h3 className="text-3xl font-bold mb-2">Platform Overview</h3>
          <p className="text-lg opacity-90">
            You're making a difference! {data.adopted} pets have found their forever homes. 🎉
          </p>
        </div>
      </div>
    </div>
  );
}