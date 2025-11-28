const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const reviewCtrl = require('../controllers/reviewController');

router.post('/', auth, reviewCtrl.addReview);
router.get('/pet/:petId', reviewCtrl.getReviewsForPet);

module.exports = router;
