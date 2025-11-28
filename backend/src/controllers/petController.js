const Pet = require('../models/Pet');
const User = require('../models/User');
const MedicalRecord = require('../models/MedicalRecord');

// create or update pet (owner only)
exports.createPet = async (req, res) => {
  try {
    const data = req.body;
    data.owner = req.user._id;
    const pet = new Pet(data);
    await pet.save();
    // If the request included health/medical info, save an initial MedicalRecord
    let initialMedical = null;
    try {
      const medical = req.body.medical;
      if (medical && Object.keys(medical).length > 0) {
        initialMedical = await MedicalRecord.create({
          pet: pet._id,
          owner: req.user._id,
          title: medical.title || 'Initial health record',
          notes: medical.notes || '',
          attachments: medical.attachments || [],

          // copy over structured health fields when present
          vaccinationStatus: medical.vaccinationStatus,
          vaccinationCard: medical.vaccinationCard,
          lastVaccinationDate: medical.lastVaccinationDate,
          nextVaccinationDate: medical.nextVaccinationDate,
          vaccines: medical.vaccines,
          deworming: medical.deworming,
          sterilization: medical.sterilization,
          medicalConditions: medical.medicalConditions,
          physicalExam: medical.physicalExam,
          labTests: medical.labTests,
          microchip: medical.microchip,
          vet: medical.vet,
          grooming: medical.grooming,
          feeding: medical.feeding
        });
      }
    } catch (mErr) {
      console.error('Failed to save initial medical record', mErr);
      // don't fail the whole request — pet was created successfully
    }

    // Return the pet and include the created initial medical record if present
    const petObj = pet.toObject ? pet.toObject() : pet;
    if (initialMedical) petObj.medical = initialMedical;
    res.json(petObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    if (!pet.owner || pet.owner.toString() === req.user._id.toString() || req.user.role === 'admin') {
      Object.assign(pet, req.body);
      await pet.save();
      return res.json(pet);
    }
    return res.status(403).json({ message: 'Not allowed to edit this pet' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// list pets with filters and owner fallback to admin when needed
// Non-admins only see available pets (status != 'adopted')
exports.listPets = async (req, res) => {
  try {
    const q = {};
    if (req.query.species) q.species = req.query.species;
    if (req.query.status) q.status = req.query.status;
    
    // Only admins can see adopted pets
    if (req.user?.role !== 'admin') {
      q.status = { $ne: 'adopted' }; // Hide adopted pets from non-admins
    }
    
    // Add search, pagination
    const page = parseInt(req.query.page || '1');
    const limit = Math.min(parseInt(req.query.limit || '20'), 100);
    const skip = (page - 1) * limit;
    const pets = await Pet.find(q).populate('owner', 'name email role').skip(skip).limit(limit).lean();
    // if a pet.owner is null, we can attach admin info (resolve admin by email in env)
    const adminEmail = process.env.ADMIN_EMAIL;
    let admin = null;
    if (adminEmail) admin = await User.findOne({ email: adminEmail }).select('name email role');
    const transformed = pets.map(p => {
      if (!p.owner && admin) p.owner = admin;
      return p;
    });

    // Attach latest medical record for each pet (non-blocking but useful for list views)
    try {
      const withMedical = await Promise.all(transformed.map(async (p) => {
        try {
          const m = await MedicalRecord.findOne({ pet: p._id }).sort({ createdAt: -1 }).lean();
          if (m) p.medical = m;
        } catch (err) {
          // ignore per-pet medical lookup errors
          console.error('Failed to load medical for pet', p._id, err.message);
        }
        return p;
      }));
      return res.json({ page, limit, items: withMedical });
    } catch (err) {
      // If medical lookups fail, fall back to returning pets without medical
      console.error('Failed to attach medical records for list', err.message);
      return res.json({ page, limit, items: transformed });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('owner', 'name email role');
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    
    // Non-admins cannot view adopted pets
    if (req.user?.role !== 'admin' && pet.status === 'adopted') {
      return res.status(403).json({ message: 'This pet is no longer available' });
    }
    
    if (!pet.owner && process.env.ADMIN_EMAIL) {
      const admin = await User.findOne({ email: process.env.ADMIN_EMAIL }).select('name email role');
      if (admin) pet.owner = admin;
    }
    // Attach the most recent medical record (if any) so the frontend can show medical info inline
    try {
      const latestMedical = await MedicalRecord.findOne({ pet: pet._id }).sort({ createdAt: -1 }).lean();
      const petObj = pet.toObject ? pet.toObject() : pet;
      if (latestMedical) petObj.medical = latestMedical;
      return res.json(petObj);
    } catch (mErr) {
      console.error('Failed to load medical for pet', mErr);
      return res.json(pet);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    if (req.user.role !== 'admin' && pet.owner?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to delete' });
    }
    await pet.remove();
    res.json({ message: 'Pet deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
