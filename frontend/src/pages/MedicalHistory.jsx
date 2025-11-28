import React, { useEffect, useState } from 'react';
import { Heart, Plus, Trash2, FileText, Calendar, User, Paperclip, Stethoscope, AlertCircle } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import uploadHelper from '../utils/uploadHelper';

export default function MedicalHistory({ petId }) {
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state: group by sections
  const [form, setForm] = useState({
    title: '',
    notes: '',
    attachments: [],

    vaccinationStatus: false,
    vaccinationCard: '',
    lastVaccinationDate: '',
    nextVaccinationDate: '',
    vaccines: { dog: {}, cat: {}, rabbit: {} },

    deworming: { lastDate: '', nextDate: '', tickFleaTreatment: false, tickFleaDate: '' },
    sterilization: { status: false, date: '', clinicName: '' },
    medicalConditions: { chronicIllness: '', pastInjuries: '', medications: '', allergies: '', behaviouralNotes: '' },
    physicalExam: { weightKg: '', bodyCondition: '', dentalCondition: '', coatCondition: '', mobility: '' },
    labTests: { dog: { tickFever: '', heartworm: '', cbcReport: '' }, cat: { fiv: '', felv: '', cbcReport: '' }, rabbit: { dentalCheckCompleted: false, parasiteTest: false } },
    microchip: { id: '', registered: false },
    vet: { name: '', clinicAddress: '', contactNumber: '', lastCheckupDate: '' },
    grooming: { bathingFrequency: '', nailTrimmedRecently: false, earCleaningDate: '' },
    feeding: { currentDiet: '', feedingSchedule: '', foodRestrictions: '' }
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [petRes, recRes] = await Promise.all([
          api.get(`/pets/${petId}`),
          api.get(`/medical/pet/${petId}`)
        ]);
        setPet(petRes.data);
        setRecords(recRes.data || []);
      } catch (err) {
        console.error('Failed to load medical history', err);
      }
      setLoading(false);
    }
    if (petId) load();
  }, [petId]);

  const canEdit = user && (user.role === 'owner' || user.role === 'admin' || (pet && pet.owner && String(pet.owner._id) === String(user._id)));

  const handleFile = async (e, field = 'attachments') => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadHelper(file);
      setForm(prev => ({ ...prev, [field]: [...(prev[field] || []), url] }));
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed');
    }
  };

  const handleVaccinationCard = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadHelper(file);
      setForm(prev => ({ ...prev, vaccinationCard: url }));
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed');
    }
  };

  // helper to render species-specific vaccine checkboxes (keeps JSX simpler)
  const renderVaccineCheckboxes = () => {
    if (!pet?.species) return null;
    const s = pet.species.toLowerCase();
    if (s === 'dog') {
      const keys = ['parvo','distemper','hepatitis','rabies','dhppi_booster'];
      return keys.map(k => (
        <label key={k} className="inline-flex items-center gap-2">
          <input type="checkbox" checked={!!form.vaccines.dog?.[k]} onChange={e=>setForm(s=>({ ...s, vaccines: { ...s.vaccines, dog: { ...s.vaccines.dog, [k]: e.target.checked } } }))} />
          {k.replace('_',' ').toUpperCase()}
        </label>
      ));
    }
    if (s === 'cat') {
      const keys = ['fvrcp','rabies','felv'];
      return keys.map(k => (
        <label key={k} className="inline-flex items-center gap-2">
          <input type="checkbox" checked={!!form.vaccines.cat?.[k]} onChange={e=>setForm(s=>({ ...s, vaccines: { ...s.vaccines, cat: { ...s.vaccines.cat, [k]: e.target.checked } } }))} />
          {k.toUpperCase()}
        </label>
      ));
    }
    if (s === 'rabbit') {
      const keys = ['myxomatosis','rhdv1','rhdv2'];
      return keys.map(k => (
        <label key={k} className="inline-flex items-center gap-2">
          <input type="checkbox" checked={!!form.vaccines.rabbit?.[k]} onChange={e=>setForm(s=>({ ...s, vaccines: { ...s.vaccines, rabbit: { ...s.vaccines.rabbit, [k]: e.target.checked } } }))} />
          {k.toUpperCase()}
        </label>
      ));
    }
    return null;
  };

  const submit = async () => {
    if (!form.title && !form.notes) {
      alert('Please provide a title or notes');
      return;
    }

    try {
      const payload = { ...form, petId };
      // convert empty strings for dates/nums to undefined where appropriate
      if (payload.physicalExam && payload.physicalExam.weightKg === '') payload.physicalExam.weightKg = undefined;
      await api.post('/medical', payload);
      // refresh
      const recRes = await api.get(`/medical/pet/${petId}`);
      setRecords(recRes.data || []);
      // reset only the record-specific fields
      setForm(prev => ({ ...prev, title: '', notes: '', attachments: [] }));
      alert('Medical record saved');
    } catch (err) {
      console.error('Save failed', err);
      alert(err.response?.data?.message || 'Failed to save medical record');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medical record?')) return;
    try {
      await api.delete(`/medical/${id}`);
      setRecords(records.filter(r => r._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  };

  if (loading) return (
    <div className="p-6 bg-white rounded-2xl shadow">Loading medical history...</div>
  );

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-pink-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Stethoscope className="text-white" size={24} />
        </div>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Medical History</h3>
      </div>

      {/* Add Record Form (only for owners/admins) */}
      {canEdit && (
        <div className="mb-8 p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border-2 border-pink-200">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="text-pink-600" size={20} />
            <h4 className="text-lg font-semibold text-gray-800">Add / Update Health Info</h4>
          </div>

          <div className="space-y-4">
            {/* Basic */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input type="text" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full px-4 py-3 bg-white rounded-xl border-2 border-pink-200" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
              <textarea value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} rows={4} className="w-full px-4 py-3 bg-white rounded-xl border-2 border-pink-200 resize-none" />
            </div>

            {/* 1. Vaccination */}
            <div className="p-4 bg-white rounded-xl border-2 border-purple-50">
              <h5 className="font-semibold mb-2">Vaccination</h5>
              <div className="flex items-center gap-3 mb-2">
                <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.vaccinationStatus} onChange={e=>setForm({...form, vaccinationStatus:e.target.checked})} /> Vaccination up-to-date</label>
              </div>
              <div className="grid md:grid-cols-3 gap-2 mb-2">
                <input type="date" value={form.lastVaccinationDate} onChange={e=>setForm({...form, lastVaccinationDate:e.target.value})} className="p-2 border rounded" />
                <input type="date" value={form.nextVaccinationDate} onChange={e=>setForm({...form, nextVaccinationDate:e.target.value})} className="p-2 border rounded" />
                <div>
                  <label className="block text-sm">Vaccination Card (PDF/Image)</label>
                  <input type="file" accept="image/*,application/pdf" onChange={handleVaccinationCard} />
                </div>
              </div>

              {/* Species-specific vaccine checkboxes */}
              {pet?.species && (
                <div className="mt-2">
                  <div className="font-medium mb-1">Vaccines for {pet.species}</div>
                  <div className="flex gap-3 flex-wrap">
                    {renderVaccineCheckboxes()}
                  </div>
                </div>
              )}
            </div>

            {/* Deworming */}
            <div className="p-4 bg-white rounded-xl border-2 border-purple-50">
              <h5 className="font-semibold mb-2">Deworming & Parasite Control</h5>
              <div className="grid md:grid-cols-3 gap-2">
                <input type="date" value={form.deworming.lastDate} onChange={e=>setForm(s=>({ ...s, deworming: { ...s.deworming, lastDate: e.target.value } }))} />
                <input type="date" value={form.deworming.nextDate} onChange={e=>setForm(s=>({ ...s, deworming: { ...s.deworming, nextDate: e.target.value } }))} />
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.deworming.tickFleaTreatment} onChange={e=>setForm(s=>({ ...s, deworming: { ...s.deworming, tickFleaTreatment: e.target.checked } }))} /> Tick/Flea Treatment</label>
                </div>
                <input type="date" value={form.deworming.tickFleaDate} onChange={e=>setForm(s=>({ ...s, deworming: { ...s.deworming, tickFleaDate: e.target.value } }))} />
              </div>
            </div>

            {/* Sterilization */}
            <div className="p-4 bg-white rounded-xl border-2 border-purple-50">
              <h5 className="font-semibold mb-2">Sterilization</h5>
              <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.sterilization.status} onChange={e=>setForm(s=>({ ...s, sterilization: { ...s.sterilization, status: e.target.checked } }))} /> Spayed / Neutered</label>
              <div className="grid md:grid-cols-2 gap-2 mt-2">
                <input type="date" value={form.sterilization.date} onChange={e=>setForm(s=>({ ...s, sterilization: { ...s.sterilization, date: e.target.value } }))} />
                <input type="text" placeholder="Clinic name" value={form.sterilization.clinicName} onChange={e=>setForm(s=>({ ...s, sterilization: { ...s.sterilization, clinicName: e.target.value } }))} />
              </div>
            </div>

            {/* Medical conditions */}
            <div className="p-4 bg-white rounded-xl border-2 border-purple-50">
              <h5 className="font-semibold mb-2">Medical Conditions</h5>
              <textarea placeholder="Chronic illness" value={form.medicalConditions.chronicIllness} onChange={e=>setForm(s=>({ ...s, medicalConditions: { ...s.medicalConditions, chronicIllness: e.target.value } }))} className="w-full mb-2" />
              <textarea placeholder="Past injuries" value={form.medicalConditions.pastInjuries} onChange={e=>setForm(s=>({ ...s, medicalConditions: { ...s.medicalConditions, pastInjuries: e.target.value } }))} className="w-full mb-2" />
              <textarea placeholder="Medications" value={form.medicalConditions.medications} onChange={e=>setForm(s=>({ ...s, medicalConditions: { ...s.medicalConditions, medications: e.target.value } }))} className="w-full mb-2" />
              <textarea placeholder="Allergies" value={form.medicalConditions.allergies} onChange={e=>setForm(s=>({ ...s, medicalConditions: { ...s.medicalConditions, allergies: e.target.value } }))} className="w-full mb-2" />
              <textarea placeholder="Behavioural notes" value={form.medicalConditions.behaviouralNotes} onChange={e=>setForm(s=>({ ...s, medicalConditions: { ...s.medicalConditions, behaviouralNotes: e.target.value } }))} className="w-full" />
            </div>

            {/* Physical exam */}
            <div className="p-4 bg-white rounded-xl border-2 border-purple-50">
              <h5 className="font-semibold mb-2">Physical Exam</h5>
              <div className="grid md:grid-cols-3 gap-2">
                <input type="number" step="0.1" placeholder="Weight (kg)" value={form.physicalExam.weightKg} onChange={e=>setForm(s=>({ ...s, physicalExam: { ...s.physicalExam, weightKg: e.target.value } }))} />
                <select value={form.physicalExam.bodyCondition} onChange={e=>setForm(s=>({ ...s, physicalExam: { ...s.physicalExam, bodyCondition: e.target.value } }))}>
                  <option value="">Body Condition</option>
                  <option>Thin</option>
                  <option>Normal</option>
                  <option>Overweight</option>
                </select>
                <select value={form.physicalExam.dentalCondition} onChange={e=>setForm(s=>({ ...s, physicalExam: { ...s.physicalExam, dentalCondition: e.target.value } }))}>
                  <option value="">Dental Condition</option>
                  <option>Good</option>
                  <option>Average</option>
                  <option>Poor</option>
                </select>
                <select value={form.physicalExam.coatCondition} onChange={e=>setForm(s=>({ ...s, physicalExam: { ...s.physicalExam, coatCondition: e.target.value } }))}>
                  <option value="">Coat Condition</option>
                  <option>Healthy</option>
                  <option>Dull</option>
                  <option>Bald Patches</option>
                </select>
                <select value={form.physicalExam.mobility} onChange={e=>setForm(s=>({ ...s, physicalExam: { ...s.physicalExam, mobility: e.target.value } }))}>
                  <option value="">Mobility</option>
                  <option>Normal</option>
                  <option>Limping</option>
                  <option>Arthritis</option>
                </select>
              </div>
            </div>

            {/* Lab tests - simple inputs and file uploads */}
            <div className="p-4 bg-white rounded-xl border-2 border-purple-50">
              <h5 className="font-semibold mb-2">Lab Tests</h5>
              {pet?.species?.toLowerCase() === 'dog' && (
                <div className="grid md:grid-cols-3 gap-2">
                  <select value={form.labTests.dog.tickFever} onChange={e=>setForm(s=>({ ...s, labTests: { ...s.labTests, dog: { ...s.labTests.dog, tickFever: e.target.value } } }))}>
                    <option value="">Tick Fever</option>
                    <option>Positive</option>
                    <option>Negative</option>
                  </select>
                  <select value={form.labTests.dog.heartworm} onChange={e=>setForm(s=>({ ...s, labTests: { ...s.labTests, dog: { ...s.labTests.dog, heartworm: e.target.value } } }))}>
                    <option value="">Heartworm</option>
                    <option>Positive</option>
                    <option>Negative</option>
                  </select>
                  <div>
                    <label className="block text-sm">CBC Report (upload)</label>
                    <input type="file" accept="image/*,application/pdf" onChange={async e=>{ const f=e.target.files[0]; if(!f) return; const url=await uploadHelper(f); setForm(s=>({ ...s, labTests: { ...s.labTests, dog: { ...s.labTests.dog, cbcReport: url } } })); }} />
                  </div>
                </div>
              )}

              {pet?.species?.toLowerCase() === 'cat' && (
                <div className="grid md:grid-cols-3 gap-2">
                  <select value={form.labTests.cat.fiv} onChange={e=>setForm(s=>({ ...s, labTests: { ...s.labTests, cat: { ...s.labTests.cat, fiv: e.target.value } } }))}>
                    <option value="">FIV</option>
                    <option>Positive</option>
                    <option>Negative</option>
                  </select>
                  <select value={form.labTests.cat.felv} onChange={e=>setForm(s=>({ ...s, labTests: { ...s.labTests, cat: { ...s.labTests.cat, felv: e.target.value } } }))}>
                    <option value="">FeLV</option>
                    <option>Positive</option>
                    <option>Negative</option>
                  </select>
                  <div>
                    <label className="block text-sm">CBC Report (upload)</label>
                    <input type="file" accept="image/*,application/pdf" onChange={async e=>{ const f=e.target.files[0]; if(!f) return; const url=await uploadHelper(f); setForm(s=>({ ...s, labTests: { ...s.labTests, cat: { ...s.labTests.cat, cbcReport: url } } })); }} />
                  </div>
                </div>
              )}

              {pet?.species?.toLowerCase() === 'rabbit' && (
                <div className="grid md:grid-cols-2 gap-2">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.labTests.rabbit.dentalCheckCompleted} onChange={e=>setForm(s=>({ ...s, labTests: { ...s.labTests, rabbit: { ...s.labTests.rabbit, dentalCheckCompleted: e.target.checked } } }))} /> Dental Check Completed</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.labTests.rabbit.parasiteTest} onChange={e=>setForm(s=>({ ...s, labTests: { ...s.labTests, rabbit: { ...s.labTests.rabbit, parasiteTest: e.target.checked } } }))} /> Parasite Test</label>
                </div>
              )}
            </div>

            {/* Microchip */}
            <div className="p-4 bg-white rounded-xl border-2 border-purple-50">
              <h5 className="font-semibold mb-2">Microchip</h5>
              <div className="grid md:grid-cols-2 gap-2">
                <input placeholder="Microchip ID" value={form.microchip.id} onChange={e=>setForm(s=>({ ...s, microchip: { ...s.microchip, id: e.target.value } }))} />
                <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.microchip.registered} onChange={e=>setForm(s=>({ ...s, microchip: { ...s.microchip, registered: e.target.checked } }))} /> Registered</label>
              </div>
            </div>

            {/* Vet info */}
            <div className="p-4 bg-white rounded-xl border-2 border-purple-50">
              <h5 className="font-semibold mb-2">Vet Information</h5>
              <input placeholder="Vet Name" value={form.vet.name} onChange={e=>setForm(s=>({ ...s, vet: { ...s.vet, name: e.target.value } }))} className="mb-2" />
              <input placeholder="Clinic Address" value={form.vet.clinicAddress} onChange={e=>setForm(s=>({ ...s, vet: { ...s.vet, clinicAddress: e.target.value } }))} className="mb-2" />
              <input placeholder="Contact Number" value={form.vet.contactNumber} onChange={e=>setForm(s=>({ ...s, vet: { ...s.vet, contactNumber: e.target.value } }))} className="mb-2" />
              <input type="date" value={form.vet.lastCheckupDate} onChange={e=>setForm(s=>({ ...s, vet: { ...s.vet, lastCheckupDate: e.target.value } }))} />
            </div>

            {/* Grooming */}
            <div className="p-4 bg-white rounded-xl border-2 border-purple-50">
              <h5 className="font-semibold mb-2">Grooming & Hygiene</h5>
              <input placeholder="Bathing Frequency" value={form.grooming.bathingFrequency} onChange={e=>setForm(s=>({ ...s, grooming: { ...s.grooming, bathingFrequency: e.target.value } }))} className="mb-2" />
              <label className="flex items-center gap-2 mb-2"><input type="checkbox" checked={!!form.grooming.nailTrimmedRecently} onChange={e=>setForm(s=>({ ...s, grooming: { ...s.grooming, nailTrimmedRecently: e.target.checked } }))} /> Nail Trimmed Recently</label>
              <input type="date" value={form.grooming.earCleaningDate} onChange={e=>setForm(s=>({ ...s, grooming: { ...s.grooming, earCleaningDate: e.target.value } }))} />
            </div>

            {/* Feeding */}
            <div className="p-4 bg-white rounded-xl border-2 border-purple-50">
              <h5 className="font-semibold mb-2">Feeding & Nutrition</h5>
              <select value={form.feeding.currentDiet} onChange={e=>setForm(s=>({ ...s, feeding: { ...s.feeding, currentDiet: e.target.value } }))} className="mb-2">
                <option value="">Select Diet</option>
                <option>Dry</option>
                <option>Wet</option>
                <option>Home food</option>
              </select>
              <input placeholder="Feeding Schedule" value={form.feeding.feedingSchedule} onChange={e=>setForm(s=>({ ...s, feeding: { ...s.feeding, feedingSchedule: e.target.value } }))} className="mb-2" />
              <textarea placeholder="Food Restrictions" value={form.feeding.foodRestrictions} onChange={e=>setForm(s=>({ ...s, feeding: { ...s.feeding, foodRestrictions: e.target.value } }))} />
            </div>

            {/* Attachments and submit */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Attachments</label>
              <input type="file" onChange={handleFile} accept="image/*,application/pdf" />
              <div className="flex gap-2 mt-2">
                {(form.attachments || []).map((a, idx) => (
                  <a key={idx} href={a} target="_blank" rel="noreferrer" className="px-3 py-1 bg-purple-100 rounded">{a.split('/').pop()}</a>
                ))}
              </div>
            </div>

            <div>
              <button onClick={submit} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold">Save Health Info</button>
            </div>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-4">
        {records.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-lg text-gray-500 font-semibold">No medical records yet</p>
            <p className="text-sm text-gray-400 mt-2">{canEdit ? 'Add the first medical record above' : 'Medical history will appear here'}</p>
          </div>
        ) : (
          records.map((r) => {
            const canDelete = user && (user.role === 'admin' || String(user._id) === String(r.owner?._id));
            return (
              <div key={r._id} className="p-6 bg-gradient-to-br from-white to-pink-50 rounded-2xl border-2 border-pink-100 hover:shadow-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0"><FileText className="text-white" size={20} /></div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-1">{r.title || 'Health Update'}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar size={14} />{new Date(r.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  {canDelete && (<button onClick={()=>remove(r._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>)}
                </div>

                <div className="mb-3 pl-13"><p className="text-gray-700 leading-relaxed">{r.notes}</p></div>

                {/* Attachments */}
                {r.attachments && r.attachments.length > 0 && (
                  <div className="mb-3 pl-13">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2"><Paperclip size={14} /><span className="font-semibold">Attachments:</span></div>
                    <div className="flex flex-wrap gap-2">{r.attachments.map((a, idx)=> (<a key={idx} href={a} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"> <FileText size={14} />{a.split('/').pop() || `File ${idx+1}`}</a>))}</div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500 pl-13 pt-2 border-t border-pink-100"><User size={14} /><span>Recorded by: <span className="font-semibold">{r.owner?.name}</span></span></div>
              </div>
            );
          })
        )}
      </div>

      {/* Info Banner */}
      {records.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 flex items-start gap-3"><AlertCircle className="text-blue-600" size={20} /><p className="text-sm text-gray-700"><span className="font-semibold">Health Tip:</span> Keep medical records up to date for the best care.</p></div>
      )}
    </div>
  );
}