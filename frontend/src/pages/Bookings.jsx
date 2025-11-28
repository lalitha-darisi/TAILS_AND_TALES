import React, { useState, useEffect } from 'react';
import { 
  Home, Calendar, PawPrint, 
  Clock, X, Loader, CreditCard 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';
import PaymentButton from '../components/PaymentButton';

export default function Bookings() {
  const { user } = useAuth();
  const userRole = user?.role;

  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/bookings');
      setBookings(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: 'approved' });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve booking');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: 'rejected' });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject booking');
    }
  };

  useEffect(() => {
    fetchBookings();
    const handleFocus = () => fetchBookings();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [location.pathname]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'from-green-400 to-green-500';
      case 'pending': return 'from-yellow-400 to-yellow-500';
      case 'rejected': return 'from-red-400 to-red-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center border-2 border-red-200">
          <X className="text-red-500 mx-auto mb-3" size={40} />
          <p className="text-gray-700 mb-4 font-semibold">{error}</p>
          <button 
            onClick={fetchBookings}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Floating Paw Prints Background */}
      <div className="absolute top-10 left-10 text-orange-300 opacity-30 animate-bounce">
        <PawPrint size={40} />
      </div>
      <div className="absolute top-20 right-20 text-pink-300 opacity-30 animate-bounce" style={{ animationDelay: '150ms' }}>
        <PawPrint size={30} />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 flex justify-between items-center">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-pink-600 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-pink-200"
        >
          <Home size={20} />
          Home
        </Link>

        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Refresh
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Calendar className="text-purple-600" size={40} />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              {userRole && userRole !== 'buyer' ? 'All Bookings' : 'My Bookings'}
            </h2>
          </div>
          <p className="text-gray-600 text-lg">Manage your pet adoption appointments</p>
        </div>

        <div className="space-y-6">
          {bookings.map(b => {
            const isPaid = b?.paid === true || b?.paid === 'true';
            const meetDate = formatDate(b.meetDate);

            return (
              <div 
                key={b._id}
                className="bg-white p-6 rounded-3xl shadow-xl border-2 border-purple-100 hover:shadow-2xl transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between">
                  
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`bg-gradient-to-br ${getStatusColor(b.status)} w-16 h-16 rounded-2xl flex items-center justify-center shadow-md`}>
                      <PawPrint className="text-white" size={28} />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{b.pet?.name}</h3>
                      <p className="text-gray-500 font-medium">{b.pet?.breed}</p>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm">
                        {userRole && userRole !== 'buyer' && (
                          <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
                            <span className="text-gray-600">Buyer:</span>
                            <span className="font-semibold text-purple-700">{b.buyer?.name}</span>
                          </div>
                        )}

                        {meetDate && (
                          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full">
                            <Clock size={14} className="text-orange-600" />
                            <span className="font-semibold text-orange-700">{meetDate}</span>
                          </div>
                        )}

                        {isPaid && (
                          <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                            <CreditCard size={14} className="text-green-600" />
                            <span className="font-semibold text-green-700">Payment Complete ✓</span>
                          </div>
                        )}
                      </div>

                      <span className={`inline-block mt-4 px-4 py-2 rounded-full border-2 font-semibold text-sm ${getStatusBadge(b.status)}`}>
                        {b.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-3 justify-center">
                    {userRole && userRole !== 'buyer' && b.status === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApprove(b._id)}
                          className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(b._id)}
                          className="px-6 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {userRole === 'buyer' && b.status === 'approved' && (
                      isPaid ? (
                        <span className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full font-semibold shadow-md">
                          <CreditCard size={18} />
                          Payment Complete ✓
                        </span>
                      ) : (
                        <PaymentButton
                          bookingId={b._id}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {bookings.length === 0 && (
          <div className="text-center mt-16 bg-white p-12 rounded-3xl shadow-xl border-2 border-purple-100">
            <Calendar className="mx-auto text-purple-300" size={80} />
            <h3 className="text-3xl font-bold text-gray-700 mt-4">No bookings found</h3>
            <p className="text-gray-500 mt-2">Your bookings will appear here once you make an appointment</p>
          </div>
        )}
      </div>
    </div>
  );
}