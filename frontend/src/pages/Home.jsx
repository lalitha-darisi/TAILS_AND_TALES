import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Search, Sparkles, PawPrint } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-200/30 to-pink-200/30 animate-pulse"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          {/* Floating Paw Prints */}
          <div className="absolute top-10 left-10 text-orange-300 opacity-60 animate-bounce">
            <PawPrint size={40} />
          </div>
          <div className="absolute top-20 right-20 text-pink-300 opacity-60 animate-bounce delay-150">
            <PawPrint size={30} />
          </div>
          <div className="absolute bottom-10 left-1/4 text-purple-300 opacity-60 animate-bounce delay-300">
            <PawPrint size={35} />
          </div>
          
          {/* Main Content */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="text-pink-500 fill-pink-500" size={40} />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Tails&Tales
            </h1>
            <Heart className="text-pink-500 fill-pink-500" size={40} />
          </div>
          
          <p className="text-2xl text-gray-700 mb-4 font-medium">
            Find Your Perfect Furry Friend
          </p>
          
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Browse adorable pets, chat with owners, and give a loving home to a companion waiting for you. 
            Every pet deserves a family! 🐾
          </p>
          
          <Link 
            to="/pets" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Search size={24} />
            Browse Pets
            <Sparkles size={24} />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 border-2 border-orange-100">
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Search className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Browse Pets</h3>
            <p className="text-gray-600">
              Discover dogs, cats, and other adorable pets looking for their forever home. Filter by type, age, and location.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 border-2 border-pink-100">
            <div className="bg-gradient-to-br from-pink-400 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <MessageCircle className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Chat with Owners</h3>
            <p className="text-gray-600">
              Connect directly with pet owners. Ask questions, learn about their personality, and arrange meet-ups.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 border-2 border-purple-100">
            <div className="bg-gradient-to-br from-purple-400 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Heart className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Adopt with Love</h3>
            <p className="text-gray-600">
              Reserve or adopt your new best friend. Our secure platform makes the adoption process simple and safe.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-3xl p-12 shadow-2xl text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Meet Your New Best Friend?</h2>
          <p className="text-xl mb-8 opacity-90">
            Thousands of pets are waiting for a loving home. Start your journey today!
          </p>
          <Link 
            to="/pets" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-pink-600 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <PawPrint size={24} />
            Start Browsing
            <PawPrint size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
}