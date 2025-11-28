const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const bookingCtrl = require('../controllers/bookingController');
const { requireRole } = require('../middlewares/roles');

// Create booking (buyer only)
router.post('/', auth, requireRole('buyer'), bookingCtrl.createBooking);

// Get logged-in user's bookings
router.get('/', auth, bookingCtrl.getBookingsForUser);

// Approve / Reject booking (admin or owner)
router.put('/:id/status', auth, bookingCtrl.updateBookingStatus);

// ✅ Mark booking as paid (after successful Stripe checkout)
router.put('/:id/paid', auth, bookingCtrl.markBookingPaid);

module.exports = router;
