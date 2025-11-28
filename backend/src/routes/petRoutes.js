const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/roles');
const petCtrl = require('../controllers/petController');

// Optional auth: checks token if present, but doesn't require it
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // no token, continue as guest
  }
  // Have a token, verify it
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(payload.id).select('-password').then(user => {
      if (user) {
        req.user = user;
      }
      next();
    });
  } catch (err) {
    next(); // token invalid, continue as guest
  }
};

// Public: list & view (with optional auth for filtering)
router.get('/', optionalAuth, petCtrl.listPets);
router.get('/:id', optionalAuth, petCtrl.getPet);

// Protected: create/update/delete (owner or admin)
router.post('/', auth, requireRole('owner', 'admin'), petCtrl.createPet);
router.put('/:id', auth, requireRole('owner', 'admin'), petCtrl.updatePet);
router.delete('/:id', auth, requireRole('admin'), petCtrl.deletePet);

module.exports = router;
