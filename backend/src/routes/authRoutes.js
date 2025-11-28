const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Fix: GET /auth/me used by AuthContext
router.get('/me', authMiddleware, (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  authController.getMe(req, res, next);
});



// Profile update
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;
