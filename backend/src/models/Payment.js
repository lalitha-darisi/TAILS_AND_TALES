const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  stripeSessionId: { type: String },
  amount: { type: Number }, // in cents
  currency: { type: String, default: 'usd' },
  status: { type: String }, // e.g. 'completed'
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
