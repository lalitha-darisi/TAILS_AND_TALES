const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userCtrl = require('../controllers/userController');
const { requireRole } = require('../middlewares/roles');
const User = require('../models/User'); // used by search endpoint

// profile
router.get('/me', auth, userCtrl.getProfile);
router.put('/me', auth, userCtrl.updateProfile);

// admin-only: list users
router.get('/', auth, requireRole('admin'), userCtrl.listUsers);

// search users (auth required)
router.get('/search', auth, async (req, res) => {
  try {
    const q = req.query.q || '';
    const list = await User.find({
      $or: [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }]
    }).select('_id name email role').limit(10);
    res.json(list);
  } catch (err) {
    console.error('user search error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
