const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // filled from pet.owner or admin
  status: { type: String, enum: ['pending','approved','rejected','cancelled'], default: 'pending' },
  paid: { type: Boolean, default: false },
  reservedAt: { type: Date, default: Date.now },
  meetDate: { type: Date }, // optional appointment
  notes: { type: String }
});

module.exports = mongoose.model('Booking', BookingSchema);
