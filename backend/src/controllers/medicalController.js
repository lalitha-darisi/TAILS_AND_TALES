const MedicalRecord = require('../models/MedicalRecord');
const Pet = require('../models/Pet');

exports.createRecord = async (req, res) => {
  try {
    const {
      petId,
      title,
      notes,
      date,
      attachments,
      vaccinationStatus,
      vaccinationCard,
      lastVaccinationDate,
      nextVaccinationDate,
      vaccines,
      deworming,
      sterilization,
      medicalConditions,
      physicalExam,
      labTests,
      microchip,
      vet,
      grooming,
      feeding
    } = req.body;
    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    // Only pet owner or admin may add
    const isAdmin = req.user.role === 'admin';
    const isOwner = pet.owner && String(pet.owner) === String(req.user._id);
    if (!isAdmin && !isOwner) return res.status(403).json({ message: 'Not allowed' });

    const rec = await MedicalRecord.create({
      pet: petId,
      owner: req.user._id,
      title,
      notes,
      date: date || Date.now(),
      attachments: attachments || [],

      vaccinationStatus,
      vaccinationCard,
      lastVaccinationDate,
      nextVaccinationDate,
      vaccines,
      deworming,
      sterilization,
      medicalConditions,
      physicalExam,
      labTests,
      microchip,
      vet,
      grooming,
      feeding
    });
    res.json(rec);
  } catch (err) {
    console.error('createRecord', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getForPet = async (req, res) => {
  try {
    const petId = req.params.petId;
    const list = await MedicalRecord.find({ pet: petId }).populate('owner', 'name').sort({ date: -1 });
    res.json(list);
  } catch (err) {
    console.error('getForPet', err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const rec = await MedicalRecord.findById(req.params.id).populate('pet');
    if (!rec) return res.status(404).json({ message: 'Not found' });
    const isAdmin = req.user.role === 'admin';
    const isOwner = String(rec.owner) === String(req.user._id);
    if (!isAdmin && !isOwner) return res.status(403).json({ message: 'Not allowed' });
    await rec.remove();
    res.json({ ok: true });
  } catch (err) {
    console.error('deleteRecord', err);
    res.status(500).json({ message: err.message });
  }
};
