import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MessageCircle, Search, Sparkles, PawPrint, Home, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';

export default function PetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [bookingNote, setBookingNote] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    api.get(`/pets/${id}`)
      .then(r => { if (mounted) { setPet(r.data); setLoading(false); }})
      .catch(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  const reserve = async () => {
    if (!user) return setMessage('Please login as a buyer to make a booking.');
    if (user.role !== 'buyer') return setMessage('Only buyers can reserve pets. Switch account or register as buyer.');
    try {
      await api.post('/bookings', { petId: id, notes: bookingNote });
      setMessage('Booking created — owner will respond.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create booking.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <PawPrint className="animate-bounce text-pink-500 mx-auto mb-4" size={48} />
        <p className="text-xl text-gray-700">Loading pet details...</p>
      </div>
    </div>
  );

  if (!pet) return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="text-pink-500 mx-auto mb-4" size={48} />
        <p className="text-xl text-gray-700 mb-4">Pet not found.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all">
          <Home size={20} />
          Go Home
        </Link>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Home Button */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-pink-600 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-pink-200"
        >
          <Home size={20} />
          Home
        </Link>
      </div>

      {/* Pet Details Card */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-orange-100">
          {/* Pet Header with Image */}
          <div className="bg-gradient-to-r from-orange-200 to-pink-200 p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="relative">
                <img
                  src={pet.photos?.[0] || 'https://placehold.co/300x300'}
                  alt={pet.name}
                  className="w-64 h-64 object-cover rounded-3xl shadow-2xl border-4 border-white"
                />
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                  {pet.status || 'Available'}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                  <Heart className="text-pink-500 fill-pink-500" size={32} />
                  <h2 className="text-4xl font-bold text-gray-800">{pet.name}</h2>
                  <PawPrint className="text-orange-500" size={32} />
                </div>
                
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {pet.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <p className="text-sm text-gray-500 mb-1">Species</p>
                    <p className="font-semibold text-gray-800">{pet.species || '—'}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <p className="text-sm text-gray-500 mb-1">Breed</p>
                    <p className="font-semibold text-gray-800">{pet.breed || '—'}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-4 shadow-md inline-block">
                  <p className="text-sm text-gray-500 mb-1">Owner</p>
                  <p className="font-semibold text-gray-800">{pet.owner?.name || 'Admin'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="p-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-purple-500" size={28} />
                <h3 className="text-2xl font-bold text-gray-800">Reserve This Pet</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Interested in {pet.name}? Send a message to the owner and reserve your spot!
              </p>
              
              <textarea
                value={bookingNote}
                onChange={e => setBookingNote(e.target.value)}
                className="w-full border-2 border-purple-200 p-4 rounded-2xl focus:outline-none focus:border-purple-400 transition-colors mb-4"
                placeholder="Tell the owner why you'd be a great match for this pet..."
                rows="4"
              />
              
              <button 
                onClick={reserve} 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full md:w-auto justify-center"
              >
                <Heart size={24} />
                Reserve Now
                <Sparkles size={24} />
              </button>
              
              {message && (
                <div className="mt-4 bg-white rounded-2xl p-4 border-2 border-green-200">
                  <p className="text-green-700 font-medium">{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Medical Info Section (full display) */}
        <div className="mt-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-orange-100">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="text-orange-500 fill-orange-500" size={28} />
              <h3 className="text-2xl font-bold text-gray-800">Health & Medical Information</h3>
            </div>
            
            {!pet.medical && (
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 text-center">
                <AlertCircle className="text-orange-400 mx-auto mb-3" size={40} />
                <p className="text-gray-600">No medical information provided by the owner.</p>
              </div>
            )}

            {pet.medical && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-4">
                  <p className="text-sm text-gray-700">Record: <span className="font-semibold text-gray-800">{pet.medical.title || 'Initial health record'}</span></p>
                  {pet.medical.createdAt && <p className="text-xs text-gray-500 mt-1">Updated {new Date(pet.medical.createdAt).toLocaleString()}</p>}
                </div>

                {pet.medical.notes && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-100">
                    <h5 className="font-semibold text-gray-800 mb-2">Notes</h5>
                    <p className="text-gray-700">{pet.medical.notes}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl shadow-md border-2 border-orange-100">
                    <h5 className="font-semibold text-gray-800 mb-3">Vaccination</h5>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div><span className="font-medium">Up to date:</span> {pet.medical.vaccinationStatus ? '✅ Yes' : '❌ No'}</div>
                      {pet.medical.lastVaccinationDate && <div><span className="font-medium">Last:</span> {new Date(pet.medical.lastVaccinationDate).toLocaleDateString()}</div>}
                      {pet.medical.nextVaccinationDate && <div><span className="font-medium">Next:</span> {new Date(pet.medical.nextVaccinationDate).toLocaleDateString()}</div>}
                      {pet.medical.vaccinationCard && <div className="mt-3"><a href={pet.medical.vaccinationCard} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-pink-600 font-medium hover:text-pink-700 underline">View vaccination card →</a></div>}
                    </div>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-md border-2 border-purple-100">
                    <h5 className="font-semibold text-gray-800 mb-3">Sterilization</h5>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div><span className="font-medium">Status:</span> {pet.medical.sterilization?.status ? '✅ Yes' : '❌ No'}</div>
                      {pet.medical.sterilization?.date && <div><span className="font-medium">Date:</span> {new Date(pet.medical.sterilization.date).toLocaleDateString()}</div>}
                      {pet.medical.sterilization?.clinicName && <div><span className="font-medium">Clinic:</span> {pet.medical.sterilization.clinicName}</div>}
                    </div>
                  </div>
                </div>

                {/* Vaccines per species */}
                {pet.medical.vaccines && Object.keys(pet.medical.vaccines).length > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-5 border-2 border-orange-100">
                    <h5 className="font-semibold text-gray-800 mb-3">Vaccines</h5>
                    <div className="flex gap-3 flex-wrap">
                      {Object.entries(pet.medical.vaccines).map(([species, vobj]) => (
                        <div key={species} className="p-4 bg-white rounded-xl shadow-md border-2 border-pink-100">
                          <div className="text-xs text-pink-600 font-semibold mb-2 uppercase">{species}</div>
                          <div className="mt-2 text-sm text-gray-700">
                            {Object.entries(vobj || {}).filter(([,val]) => !!val).length === 0 ? <div className="text-gray-400">No vaccines recorded</div> : (
                              Object.entries(vobj || {}).map(([k, val]) => val ? <div key={k} className="inline-block mr-2 mb-2 px-3 py-1 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full border border-orange-200 text-xs font-medium">{k.replace('_',' ')}</div> : null)
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deworming */}
                {pet.medical.deworming && Object.keys(pet.medical.deworming).length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-100">
                    <h5 className="font-semibold text-gray-800 mb-3">Deworming & Parasite Control</h5>
                    <div className="text-sm text-gray-700 space-y-2">
                      {pet.medical.deworming.lastDate && <div><span className="font-medium">Last:</span> {new Date(pet.medical.deworming.lastDate).toLocaleDateString()}</div>}
                      {pet.medical.deworming.nextDate && <div><span className="font-medium">Next:</span> {new Date(pet.medical.deworming.nextDate).toLocaleDateString()}</div>}
                      {typeof pet.medical.deworming.tickFleaTreatment !== 'undefined' && <div><span className="font-medium">Tick/Flea Treatment:</span> {pet.medical.deworming.tickFleaTreatment ? '✅ Yes' : '❌ No'}</div>}
                      {pet.medical.deworming.tickFleaDate && <div><span className="font-medium">Tick/Flea Date:</span> {new Date(pet.medical.deworming.tickFleaDate).toLocaleDateString()}</div>}
                    </div>
                  </div>
                )}

                {/* Medical Conditions */}
                {pet.medical.medicalConditions && Object.keys(pet.medical.medicalConditions).length > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-5 border-2 border-orange-100">
                    <h5 className="font-semibold text-gray-800 mb-3">Medical Conditions</h5>
                    <div className="text-sm text-gray-700 space-y-2">
                      {Object.entries(pet.medical.medicalConditions).map(([k, v]) => v ? <div key={k} className="bg-white rounded-lg p-3 shadow-sm"><span className="font-medium text-orange-600">{k.replace(/([A-Z])/g, ' $1')}:</span> <span className="text-gray-800">{v}</span></div> : null)}
                    </div>
                  </div>
                )}

                {/* Physical Exam */}
                {pet.medical.physicalExam && Object.keys(pet.medical.physicalExam).length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-100">
                    <h5 className="font-semibold text-gray-800 mb-3">Physical Exam</h5>
                    <div className="text-sm text-gray-700 space-y-2">
                      {Object.entries(pet.medical.physicalExam).map(([k, v]) => v ? <div key={k} className="bg-white rounded-lg p-3 shadow-sm"><span className="font-medium text-purple-600">{k.replace(/([A-Z])/g, ' $1')}:</span> <span className="text-gray-800">{v}</span></div> : null)}
                    </div>
                  </div>
                )}

                {/* Lab Tests */}
                {pet.medical.labTests && Object.keys(pet.medical.labTests).length > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-5 border-2 border-orange-100">
                    <h5 className="font-semibold text-gray-800 mb-3">Lab Tests</h5>
                    <div className="flex gap-3 flex-wrap">
                      {Object.entries(pet.medical.labTests).map(([species, labObj]) => (
                        <div key={species} className="p-4 bg-white rounded-xl shadow-md border-2 border-pink-100 flex-1 min-w-[250px]">
                          <div className="text-xs text-pink-600 font-semibold mb-2 uppercase">{species}</div>
                          <div className="mt-2 text-sm text-gray-700 space-y-2">
                            {Object.entries(labObj || {}).map(([k, v]) => v ? <div key={k}><span className="font-medium text-orange-600">{k.replace(/([A-Z])/g, ' $1')}:</span> <span className="text-gray-800">{v}</span></div> : null)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Microchip */}
                {pet.medical.microchip && Object.keys(pet.medical.microchip).length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-100">
                    <h5 className="font-semibold text-gray-800 mb-3">Microchip</h5>
                    <div className="text-sm text-gray-700 space-y-2">
                      {pet.medical.microchip.id && <div className="bg-white rounded-lg p-3 shadow-sm"><span className="font-medium text-purple-600">ID:</span> <span className="text-gray-800 font-mono">{pet.medical.microchip.id}</span></div>}
                      {typeof pet.medical.microchip.registered !== 'undefined' && <div className="bg-white rounded-lg p-3 shadow-sm"><span className="font-medium text-purple-600">Registered:</span> <span className="text-gray-800">{pet.medical.microchip.registered ? '✅ Yes' : '❌ No'}</span></div>}
                    </div>
                  </div>
                )}

                {/* Vet */}
                {pet.medical.vet && Object.keys(pet.medical.vet).length > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-5 border-2 border-orange-100">
                    <h5 className="font-semibold text-gray-800 mb-3">Veterinary</h5>
                    <div className="text-sm text-gray-700 space-y-2">
                      {pet.medical.vet.name && <div className="bg-white rounded-lg p-3 shadow-sm"><span className="font-medium text-orange-600">Name:</span> <span className="text-gray-800">{pet.medical.vet.name}</span></div>}
                      {pet.medical.vet.clinicAddress && <div className="bg-white rounded-lg p-3 shadow-sm"><span className="font-medium text-orange-600">Clinic:</span> <span className="text-gray-800">{pet.medical.vet.clinicAddress}</span></div>}
                      {pet.medical.vet.contactNumber && <div className="bg-white rounded-lg p-3 shadow-sm"><span className="font-medium text-orange-600">Contact:</span> <span className="text-gray-800">{pet.medical.vet.contactNumber}</span></div>}
                      {pet.medical.vet.lastCheckupDate && <div className="bg-white rounded-lg p-3 shadow-sm"><span className="font-medium text-orange-600">Last checkup:</span> <span className="text-gray-800">{new Date(pet.medical.vet.lastCheckupDate).toLocaleDateString()}</span></div>}
                    </div>
                  </div>
                )}

                {/* Grooming */}
                {pet.medical.grooming && Object.keys(pet.medical.grooming).length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-100">
                    <h5 className="font-semibold text-gray-800 mb-3">Grooming</h5>
                    <div className="text-sm text-gray-700 space-y-2">
                      {Object.entries(pet.medical.grooming).map(([k, v]) => v ? <div key={k} className="bg-white rounded-lg p-3 shadow-sm"><span className="font-medium text-purple-600">{k.replace(/([A-Z])/g, ' $1')}:</span> <span className="text-gray-800">{String(v)}</span></div> : null)}
                    </div>
                  </div>
                )}

                {/* Feeding */}
                {pet.medical.feeding && Object.keys(pet.medical.feeding).length > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-5 border-2 border-orange-100">
                    <h5 className="font-semibold text-gray-800 mb-3">Feeding & Nutrition</h5>
                    <div className="text-sm text-gray-700 space-y-2">
                      {pet.medical.feeding.currentDiet && <div className="bg-white rounded-lg p-3 shadow-sm"><span className="font-medium text-orange-600">Diet:</span> <span className="text-gray-800">{pet.medical.feeding.currentDiet}</span></div>}
                      {pet.medical.feeding.feedingSchedule && <div className="bg-white rounded-lg p-3 shadow-sm"><span className="font-medium text-orange-600">Schedule:</span> <span className="text-gray-800">{pet.medical.feeding.feedingSchedule}</span></div>}
                      {pet.medical.feeding.foodRestrictions && <div className="bg-white rounded-lg p-3 shadow-sm"><span className="font-medium text-orange-600">Restrictions:</span> <span className="text-gray-800">{pet.medical.feeding.foodRestrictions}</span></div>}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {pet.medical.attachments && pet.medical.attachments.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-100">
                    <h5 className="font-semibold text-gray-800 mb-3">Attachments</h5>
                    <div className="flex gap-3 flex-wrap">
                      {pet.medical.attachments.map((a, i) => (
                        <a key={i} href={a} target="_blank" rel="noreferrer" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all">{a.split('/').pop()}</a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}