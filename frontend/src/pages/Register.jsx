import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Heart, PawPrint, Mail, Lock, User, UserCircle, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [payload, setPayload] = useState({ name:'', email:'', password:'', role:'buyer' });
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const res = await register(payload);
    if (res.ok) nav('/');
    else setErr(res.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Floating Paw Prints Background */}
      <div className="absolute top-10 left-10 text-orange-300 opacity-40 animate-bounce">
        <PawPrint size={40} />
      </div>
      <div className="absolute top-20 right-20 text-pink-300 opacity-40 animate-bounce" style={{ animationDelay: '150ms' }}>
        <PawPrint size={30} />
      </div>
      <div className="absolute bottom-10 left-1/4 text-purple-300 opacity-40 animate-bounce" style={{ animationDelay: '300ms' }}>
        <PawPrint size={35} />
      </div>
      <div className="absolute bottom-20 right-1/3 text-orange-300 opacity-40 animate-bounce" style={{ animationDelay: '450ms' }}>
        <PawPrint size={25} />
      </div>

      {/* Home Button - Below Nav Bar */}
      <div className="pt-6 px-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-pink-600 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-pink-200"
        >
          <Home size={20} />
          Home
        </Link>
      </div>

      {/* Register Card */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-orange-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-200 to-pink-200 p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkles className="text-purple-500" size={36} />
                <h2 className="text-4xl font-bold text-gray-800">Join PetAdopt</h2>
                <Heart className="text-pink-500 fill-pink-500" size={36} />
              </div>
              <p className="text-gray-700 text-lg">Create your account and start helping pets!</p>
            </div>

            {/* Error Message */}
            {err && (
              <div className="mx-8 mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-800 font-medium">{err}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={submit} className="p-8 space-y-5">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    value={payload.name} 
                    onChange={e => setPayload({...payload, name: e.target.value})} 
                    placeholder="Your name" 
                    className="w-full border-2 border-purple-200 p-4 pl-12 rounded-2xl focus:outline-none focus:border-purple-400 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    value={payload.email} 
                    onChange={e => setPayload({...payload, email: e.target.value})} 
                    placeholder="your@email.com" 
                    type="email"
                    className="w-full border-2 border-purple-200 p-4 pl-12 rounded-2xl focus:outline-none focus:border-purple-400 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    value={payload.password} 
                    onChange={e => setPayload({...payload, password: e.target.value})} 
                    placeholder="Create a password" 
                    type="password"
                    className="w-full border-2 border-purple-200 p-4 pl-12 rounded-2xl focus:outline-none focus:border-purple-400 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  I want to...
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select 
                    value={payload.role} 
                    onChange={e => setPayload({...payload, role: e.target.value})} 
                    className="w-full border-2 border-purple-200 p-4 pl-12 rounded-2xl focus:outline-none focus:border-purple-400 transition-colors appearance-none bg-white cursor-pointer"
                  >
                    <option value="buyer">🏠 Adopt a Pet (Buyer)</option>
                    <option value="owner">🐾 List Pets for Adoption (Owner)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Sparkles size={24} />
                Create Account
                <PawPrint size={24} />
              </button>
            </form>

            {/* Login Link */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 text-center border-t-2 border-purple-100">
              <p className="text-gray-700">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-1 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}