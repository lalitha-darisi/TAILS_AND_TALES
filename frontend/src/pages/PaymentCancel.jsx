import React from 'react';
import { Home, XCircle, PawPrint, ArrowLeft, Heart } from 'lucide-react';

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
      {/* Floating Paw Prints */}
      <div className="absolute top-10 left-10 text-orange-300 opacity-30 animate-bounce">
        <PawPrint size={40} />
      </div>
      <div className="absolute top-20 right-20 text-pink-300 opacity-30 animate-bounce" style={{ animationDelay: '150ms' }}>
        <PawPrint size={30} />
      </div>
      <div className="absolute bottom-20 left-1/4 text-purple-300 opacity-20 animate-bounce" style={{ animationDelay: '300ms' }}>
        <PawPrint size={35} />
      </div>
      
      {/* Home Button - Fixed Position */}
      <div className="fixed top-6 left-6 z-10">
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-pink-600 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-pink-200"
        >
          <Home size={20} />
          Home
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-orange-200 text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <XCircle className="text-white" size={48} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="text-white" size={20} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Payment Cancelled
          </h2>

          {/* Message */}
          <p className="text-lg text-gray-700 mb-2 leading-relaxed">
            Your payment was cancelled — no charges were made.
          </p>
          <p className="text-gray-600 mb-8">
            Don't worry! You can try again whenever you're ready.
          </p>

          {/* Divider */}
          <div className="h-1 bg-gradient-to-r from-orange-300 via-red-300 to-pink-300 rounded-full mb-8 opacity-50"></div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft size={20} />
              Back to Bookings
            </button>
            
            <button 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-pink-600 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-pink-200"
            >
              <PawPrint size={20} />
              Browse Pets
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border-2 border-orange-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Need help?</span> Contact our support team if you experienced any issues during checkout.
            </p>
          </div>
        </div>

        {/* Reassurance Banner */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-3xl p-8 shadow-2xl text-white text-center">
          <h3 className="text-2xl font-bold mb-2">🐾 Take Your Time</h3>
          <p className="text-lg opacity-90">
            Finding the perfect pet is a big decision. We're here whenever you're ready!
          </p>
        </div>
      </div>
    </div>
  );
}