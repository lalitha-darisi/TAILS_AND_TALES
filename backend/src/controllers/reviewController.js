const Review = require('../models/Review');
const Pet = require('../models/Pet');

exports.addReview = async (req, res) => {
  const { petId, rating, comment } = req.body;
  const review = await Review.create({ pet: petId, user: req.user._id, rating, comment });
  // Optionally update pet average rating (simple aggregation)
  const agg = await Review.aggregate([
    { $match: { pet: review.pet } },
    { $group: { _id: '$pet', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const stats = agg[0] || null;
  // return review and stats
  res.json({ review, stats });
};

exports.getReviewsForPet = async (req, res) => {
  const reviews = await Review.find({ pet: req.params.petId }).populate('user', 'name');
  res.json(reviews);
};
