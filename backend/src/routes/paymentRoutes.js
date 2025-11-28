// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/paymentController');

// Create a Stripe Checkout session
router.post('/create-checkout', auth, ctrl.createCheckoutSession);

// Fetch session info
// src/routes/paymentRoutes.js
router.get('/session-details', ctrl.fetchSessionDetails);

// Test webhook (optional)
router.post('/test-webhook', auth, ctrl.simulateWebhook);

module.exports = router;
