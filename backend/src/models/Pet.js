const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true }, // e.g., dog, cat
  breed: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['male','female','unknown'], default: 'unknown' },
  description: { type: String },
  photos: [{ type: String }], // URLs or base64 (preferably URLs to cloud storage)
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // if null => default owner = admin (resolve in queries)
  status: { type: String, enum: ['available','reserved','adopted'], default: 'available' },
  location: { type: String },
  price: { type: Number, default: 0 }, // if marketplace
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pet', PetSchema);
