const Booking = require('../models/Booking');
const Pet = require('../models/Pet');
const User = require('../models/User');
const Review = require('../models/Review');

exports.getAdminAnalytics = async (req, res) => {
  try {
    const totalPets = await Pet.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const adopted = await Pet.countDocuments({ status: 'adopted' });
    const avgRatingAgg = await Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]);
    const avgRating = avgRatingAgg[0] ? avgRatingAgg[0].avg : 0;
    res.json({ totalPets, totalUsers, totalBookings, adopted, avgRating });
  } catch (err) {
    console.error('getAdminAnalytics', err);
    res.status(500).json({ message: err.message });
  }
};
