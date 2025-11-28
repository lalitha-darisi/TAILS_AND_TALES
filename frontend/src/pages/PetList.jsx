import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Heart, PawPrint, Sparkles, Search, AlertCircle } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../contexts/AuthContext';

export default function PetList() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pets').then(r => {
      setPets(r.data.items || r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <PawPrint className="animate-bounce text-pink-500 mx-auto mb-4" size={48} />
        <p className="text-xl text-gray-700">Loading adorable pets...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Search className="text-orange-500" size={36} />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              {user?.role === 'admin' ? 'All Pets' : 'Available Pets'}
            </h2>
            <Heart className="text-pink-500 fill-pink-500" size={36} />
          </div>
          <p className="text-lg text-gray-600">Find your perfect furry companion today!</p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {['all', 'dog', 'cat', 'rabbit'].map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full font-semibold transition-all border-2 ${category === c ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg' : 'bg-white text-gray-700 border-orange-100 hover:scale-105'}`}
            >
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {pets.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border-2 border-orange-100">
              <AlertCircle className="text-gray-400 mx-auto mb-4" size={64} />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Pets Available</h3>
              <p className="text-gray-600 mb-6">
                There are no pets available at the moment. Check back soon!
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
              >
                <Home size={20} />
                Go Home
              </Link>
            </div>
          </div>
        ) : (
          /* Pet Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets
              .filter(p => {
                if (category === 'all') return true;
                return (p.species || '').toLowerCase() === category;
              })
              .map(p => (
              <div key={p._id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-orange-100 transform hover:scale-105">
                {/* Pet Image */}
                <div className="relative h-48 bg-gradient-to-br from-orange-200 to-pink-200 overflow-hidden">
                  <img 
                    src={p.photos?.[0] || 'https://placehold.co/400x300'} 
                    alt={p.name} 
                    className="w-full h-full object-cover"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
                      p.status === 'adopted' 
                        ? 'bg-green-500 text-white' 
                        : p.status === 'reserved' 
                        ? 'bg-yellow-400 text-gray-800' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {p.status || 'available'}
                    </span>
                  </div>
                </div>

                {/* Pet Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <PawPrint className="text-orange-500" size={20} />
                    <h3 className="text-2xl font-bold text-gray-800">{p.name}</h3>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-semibold">Species:</span>
                        <span>{p.species}</span>
                      </div>
                      {p.breed && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-semibold">Breed:</span>
                          <span>{p.breed}</span>
                        </div>
                      )}

                      {/* Inline medical summary if available */}
                      {p.medical && (
                        <div className="mt-2 p-3 bg-yellow-50 rounded-xl border-2 border-yellow-100">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Health</div>
                            <div className="text-xs text-gray-500">Updated {new Date(p.medical.createdAt || p.medical.date || Date.now()).toLocaleDateString()}</div>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <div><span className="font-semibold">Vaccinated:</span> {p.medical.vaccinationStatus ? 'Yes' : 'No'}</div>
                            <div><span className="font-semibold">Sterilized:</span> {p.medical.sterilization?.status ? 'Yes' : 'No'}</div>
                            {p.medical.notes && <div className="truncate"><span className="font-semibold">Notes:</span> {p.medical.notes}</div>}
                            {p.medical.attachments && p.medical.attachments.length > 0 && (
                              <div className="mt-1 text-xs text-indigo-600"><a href={p.medical.attachments[0]} target="_blank" rel="noreferrer">View attachment</a></div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                  {/* Details Button */}
                  <Link 
                    to={`/pets/${p._id}`} 
                    className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Sparkles size={18} />
                      View Details
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}