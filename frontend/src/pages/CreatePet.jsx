import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, PawPrint, Upload, Image, Heart, Sparkles, Loader } from 'lucide-react';
import api from '../api/api';
import uploadHelper from '../utils/uploadHelper';

export default function CreatePet() {
  const [form, setForm] = useState({ name: '', species: '', breed: '', age: '', price: '', description: '', photos: [] });
  const [uploading, setUploading] = useState(false);
  const [includeHealth, setIncludeHealth] = useState(false);
  const [health, setHealth] = useState({
    title: 'Initial health record',
    notes: '',
    attachments: [],
    vaccinationStatus: false,
    vaccinationCard: '',
    lastVaccinationDate: '',
    nextVaccinationDate: '',
    vaccines: { dog: {}, cat: {}, rabbit: {} },
    deworming: { lastDate: '', nextDate: '' },
    sterilization: { status: false, date: '', clinicName: '' },
    medicalConditions: { behaviouralNotes: '' },
    physicalExam: { weightKg: '' },
    labTests: { dog: {}, cat: {}, rabbit: {} },
    microchip: { id: '', registered: false },
    vet: { name: '' },
    grooming: {},
    feeding: {}
  });

  const nav = useNavigate();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadHelper(file);
      setForm(prev => ({ ...prev, photos: [...prev.photos, url] }));
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleHealthFile = async (e, field = 'attachments') => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadHelper(file);
      setHealth(prev => ({ ...prev, [field]: [...(prev[field] || []), url] }));
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
    setUploading(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, species: (form.species || '').toLowerCase() };
      if (includeHealth) payload.medical = { ...health };
      await api.post('/pets', payload);
      nav('/pets');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create pet');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-pink-600 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-pink-200">
          <Home size={20} /> Home
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-orange-100">
          <div className="bg-gradient-to-r from-orange-200 to-pink-200 p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <PawPrint className="text-orange-600" size={36} />
              <h2 className="text-4xl font-bold text-gray-800">Add a New Pet</h2>
              <Heart className="text-pink-500 fill-pink-500" size={36} />
            </div>
            <p className="text-gray-700 text-lg">Help a furry friend find their forever home!</p>
          </div>

          <form onSubmit={submit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pet Name <span className="text-pink-500">*</span></label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Buddy" className="w-full border-2 border-purple-200 p-4 rounded-2xl" required />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Species <span className="text-pink-500">*</span></label>
                <select value={form.species} onChange={e => setForm({ ...form, species: e.target.value })} className="w-full border-2 border-purple-200 p-4 rounded-2xl bg-white" required>
                  <option value="">Select a species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Breed</label>
                <input value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} placeholder="e.g., Golden Retriever" className="w-full border-2 border-purple-200 p-4 rounded-2xl" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                <input value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="e.g., 2 years" className="w-full border-2 border-purple-200 p-4 rounded-2xl" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (USD)</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g., 100.00" className="w-full border-2 border-purple-200 p-4 rounded-2xl" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="text-pink-500">*</span></label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={5} className="w-full border-2 border-purple-200 p-4 rounded-2xl" required />
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-100">
              <div className="flex items-center gap-2 mb-4">
                <Image className="text-purple-500" size={24} />
                <label className="block text-sm font-semibold text-gray-700">Pet Photos</label>
              </div>

              <div className="relative">
                <input id="photo-upload" type="file" onChange={handleFile} className="hidden" accept="image/*" />
                <label htmlFor="photo-upload" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-white border-2 border-dashed border-purple-300 rounded-2xl cursor-pointer">
                  <Upload size={24} className="text-purple-500" />
                  <span className="font-medium text-gray-700">{uploading ? 'Uploading...' : 'Click to upload photo'}</span>
                </label>
              </div>

              {form.photos.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-3">Uploaded Photos:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {form.photos.map((p, idx) => (
                      <div key={idx} className="relative group">
                        <img src={p} alt={`Pet photo ${idx + 1}`} className="w-full h-24 object-cover rounded-xl" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <label className="inline-flex items-center gap-3">
                <input type="checkbox" checked={includeHealth} onChange={e => setIncludeHealth(e.target.checked)} />
                <span className="font-semibold">Include medical history / health info with this listing</span>
              </label>
            </div>

            {includeHealth && (
              <div className="mt-4 p-4 bg-gradient-to-br from-yellow-50 to-white rounded-2xl border-2 border-yellow-100 space-y-4">
                <h4 className="text-lg font-semibold">Initial Health Information</h4>

                <div>
                  <label className="block text-sm font-medium">Vaccination up-to-date</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!health.vaccinationStatus} onChange={e => setHealth(h => ({ ...h, vaccinationStatus: e.target.checked }))} /> Yes</label>
                </div>

                <div>
                  <label className="block text-sm font-medium">Vaccination Card (PDF/Image)</label>
                  <input type="file" accept="image/*,application/pdf" onChange={e => handleHealthFile(e, 'vaccinationCard')} />
                  <div className="mt-2">{health.vaccinationCard ? <a href={health.vaccinationCard} target="_blank" rel="noreferrer">View uploaded</a> : null}</div>
                </div>

                {form.species && (
                  <div>
                    <div className="font-medium">Vaccines for {form.species}</div>
                    <div className="flex gap-3 flex-wrap mt-2">
                      {form.species.toLowerCase() === 'dog' && ['parvo', 'distemper', 'hepatitis', 'rabies', 'dhppi_booster'].map(k => (
                        <label key={k} className="inline-flex items-center gap-2"><input type="checkbox" checked={!!health.vaccines.dog?.[k]} onChange={e => setHealth(s => ({ ...s, vaccines: { ...s.vaccines, dog: { ...s.vaccines.dog, [k]: e.target.checked } } }))} /> {k.replace('_', ' ').toUpperCase()}</label>
                      ))}
                      {form.species.toLowerCase() === 'cat' && ['fvrcp', 'rabies', 'felv'].map(k => (
                        <label key={k} className="inline-flex items-center gap-2"><input type="checkbox" checked={!!health.vaccines.cat?.[k]} onChange={e => setHealth(s => ({ ...s, vaccines: { ...s.vaccines, cat: { ...s.vaccines.cat, [k]: e.target.checked } } }))} /> {k.toUpperCase()}</label>
                      ))}
                      {form.species.toLowerCase() === 'rabbit' && ['myxomatosis', 'rhdv1', 'rhdv2'].map(k => (
                        <label key={k} className="inline-flex items-center gap-2"><input type="checkbox" checked={!!health.vaccines.rabbit?.[k]} onChange={e => setHealth(s => ({ ...s, vaccines: { ...s.vaccines, rabbit: { ...s.vaccines.rabbit, [k]: e.target.checked } } }))} /> {k.toUpperCase()}</label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-2">
                  <label className="block text-sm">Last Deworming Date</label>
                  <input type="date" value={health.deworming.lastDate} onChange={e => setHealth(s => ({ ...s, deworming: { ...s.deworming, lastDate: e.target.value } }))} />
                  <label className="block text-sm">Next Deworming Date</label>
                  <input type="date" value={health.deworming.nextDate} onChange={e => setHealth(s => ({ ...s, deworming: { ...s.deworming, nextDate: e.target.value } }))} />
                </div>

                <div className="grid md:grid-cols-2 gap-2">
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!health.sterilization.status} onChange={e => setHealth(s => ({ ...s, sterilization: { ...s.sterilization, status: e.target.checked } }))} /> Spayed / Neutered</label>
                  <input type="date" value={health.sterilization.date} onChange={e => setHealth(s => ({ ...s, sterilization: { ...s.sterilization, date: e.target.value } }))} />
                  <input placeholder="Clinic name" value={health.sterilization.clinicName} onChange={e => setHealth(s => ({ ...s, sterilization: { ...s.sterilization, clinicName: e.target.value } }))} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Medical Conditions / Notes</label>
                  <textarea value={health.medicalConditions.behaviouralNotes} onChange={e => setHealth(s => ({ ...s, medicalConditions: { ...s.medicalConditions, behaviouralNotes: e.target.value } }))} className="w-full" />
                </div>

                <div className="grid md:grid-cols-2 gap-2">
                  <input type="number" step="0.1" placeholder="Weight (kg)" value={health.physicalExam.weightKg} onChange={e => setHealth(s => ({ ...s, physicalExam: { ...s.physicalExam, weightKg: e.target.value } }))} />
                  <input placeholder="Microchip ID" value={health.microchip.id} onChange={e => setHealth(s => ({ ...s, microchip: { ...s.microchip, id: e.target.value } }))} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Vet Name</label>
                  <input value={health.vet.name} onChange={e => setHealth(s => ({ ...s, vet: { ...s.vet, name: e.target.value } }))} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Additional health attachments</label>
                  <input type="file" accept="image/*,application/pdf" onChange={e => handleHealthFile(e, 'attachments')} />
                  <div className="mt-2">{(health.attachments || []).map((a, i) => (<a key={i} href={a} target="_blank" rel="noreferrer" className="mr-2">{a.split('/').pop()}</a>))}</div>
                </div>
              </div>
            )}

            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-lg font-semibold">
              <Sparkles size={24} /> Create Pet Listing <PawPrint size={24} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}