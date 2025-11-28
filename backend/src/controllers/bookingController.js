// backend/src/controllers/bookingController.js
const Booking = require('../models/Booking');
const Pet = require('../models/Pet');
const Notification = require('../models/Notification');
const User = require('../models/User');

//
// Create a booking: buyer requests to reserve a pet
//
exports.createBooking = async (req, res) => {
  try {
    const { petId, meetDate, notes } = req.body;
    if (!petId) return res.status(400).json({ message: 'petId is required' });

    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    // ENFORCE: only allow booking when pet.status is 'available'
    // If your flow wants to allow booking on 'reserved' too, adjust this check.
    const status = String(pet.status || '').toLowerCase();
    if (status !== 'available') {
      return res.status(400).json({ message: `Pet is not available for booking (status: ${pet.status}).` });
    }

    // Resolve owner: if pet.owner exists use it, otherwise fallback to an admin user (default owner)
    let ownerId = pet.owner ? pet.owner : null;
    if (!ownerId) {
      const admin = await User.findOne({ role: 'admin' }).select('_id').lean();
      if (admin) ownerId = admin._id;
    }

    const booking = new Booking({
      pet: petId,
      buyer: req.user._id,
      owner: ownerId,
      meetDate,
      notes
    });
    await booking.save();

    // change pet status to reserved (atomic enough for this flow)
    pet.status = 'reserved';
    await pet.save();

    // create notification for owner/admin (if exists)
    if (ownerId) {
      await Notification.create({
        user: ownerId,
        title: 'New booking request',
        body: `You have a booking request for ${pet.name}`,
        meta: { bookingId: booking._id, petId }
      });
    }

    console.log('[CREATE BOOKING]', {
      actor: String(req.user._id),
      actorRole: req.user.role,
      bookingId: booking._id,
      pet: petId,
      ownerResolved: String(ownerId)
    });

    return res.status(201).json(booking);
  } catch (err) {
    console.error('createBooking error', err);
    return res.status(500).json({ message: err.message });
  }
};

//
// Update booking status (approve/reject/cancel)
//
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // expected: 'approved'|'rejected'|'cancelled'
    const booking = await Booking.findById(req.params.id).populate('pet buyer owner');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    console.log('[BOOKING ACTION ATTEMPT]', {
      actor: String(req.user._id),
      actorRole: req.user.role,
      bookingId: booking._id,
      bookingOwner: booking.owner ? String(booking.owner._id || booking.owner) : null,
      bookingBuyer: booking.buyer ? String(booking.buyer._id || booking.buyer) : null,
      requestedStatus: status
    });

    // Only admin or the pet owner (booking.owner) may act
    const isAdmin = req.user.role === 'admin';
    const isOwner = booking.owner && String(booking.owner._id || booking.owner) === String(req.user._id);
    if (!isAdmin && !isOwner) return res.status(403).json({ message: 'Not allowed' });

    booking.status = status;
    await booking.save();

    // Update pet status accordingly (only change pet, do not touch user docs)
    if (status === 'approved') {
      booking.pet.status = 'adopted';
      await booking.pet.save();
    } else if (status === 'rejected' || status === 'cancelled') {
      booking.pet.status = 'available';
      await booking.pet.save();
    }

    // Notify buyer
    await Notification.create({
      user: booking.buyer._id ? booking.buyer._id : booking.buyer,
      title: `Your booking was ${status}`,
      body: `Booking for ${booking.pet.name} is ${status}`,
      meta: { bookingId: booking._id }
    });

    console.log('[BOOKING ACTION COMPLETE]', {
      bookingId: booking._id,
      newStatus: booking.status,
      petStatus: booking.pet.status
    });

    return res.json(booking);
  } catch (err) {
    console.error('updateBookingStatus error', err);
    return res.status(500).json({ message: err.message });
  }
};

//
// Get bookings for the logged-in user (buyer/owner) or all for admin
//
exports.getBookingsForUser = async (req, res) => {
  try {
    const q = {};
    if (req.user.role === 'buyer') q.buyer = req.user._id;
    else if (req.user.role === 'owner') q.owner = req.user._id;
    // admin sees all
    const items = await Booking.find(q).populate('pet buyer owner');
    return res.json(items);
  } catch (err) {
    console.error('getBookingsForUser error', err);
    return res.status(500).json({ message: err.message });
  }
};
exports.markBookingPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("pet buyer");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Mark booking paid
    booking.paid = true;
    await booking.save();

    // Mark pet adopted
    if (booking.pet) {
      booking.pet.status = "adopted";
      await booking.pet.save();
    }

    // Notify buyer
    await Notification.create({
      user: booking.buyer._id,
      title: "Payment Successful",
      body: `You have successfully adopted ${booking.pet.name}!`,
      meta: { bookingId: booking._id, petId: booking.pet._id }
    });

    return res.json({
      message: "Payment completed. Pet marked as adopted.",
      pet: booking.pet,
      booking
    });

  } catch (err) {
    console.error("Error marking payment:", err);
    return res.status(500).json({ message: "Failed to update payment status" });
  }
};

