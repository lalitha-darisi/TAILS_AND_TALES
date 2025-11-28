const Pet = require('../models/Pet');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Review = require('../models/Review');

exports.getAdminAnalytics = async () => {
  const totalPets = await Pet.countDocuments();
  const available = await Pet.countDocuments({ status: 'available' });
  const adopted = await Pet.countDocuments({ status: 'adopted' });
  const totalUsers = await User.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const avgRatingAgg = await Review.aggregate([
    { $group: { _id: null, avg: { $avg: '$rating' } } }
  ]);
  const avgRating = avgRatingAgg[0]?.avg || 0;

  return { totalPets, available, adopted, totalUsers, totalBookings, avgRating };
};
