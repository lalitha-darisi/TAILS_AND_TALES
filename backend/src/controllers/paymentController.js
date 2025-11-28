// backend/src/controllers/paymentController.js
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Pet = require('../models/Pet');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Lazy initialize Stripe to avoid crashes if STRIPE_SECRET_KEY is missing
let stripe = null;
function getStripe() {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not set in .env');
    }
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}

exports.createCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();
    const { bookingId, successUrl, cancelUrl } = req.body;
    if (!bookingId) return res.status(400).json({ message: 'bookingId required' });

    const booking = await Booking.findById(bookingId).populate('pet buyer owner');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // amount (in cents) — expect pet.price in your Pet model (number, e.g. 100.00)
    const price = (booking.pet?.price || 100) * 100; // fallback 100 USD
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Adoption - ${booking.pet.name}`, description: booking.pet.breed || '' },
          unit_amount: price
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: successUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-cancel`,
      metadata: { bookingId: String(bookingId), buyerId: String(booking.buyer._id) }
    });

    res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('createCheckoutSession error', err);
    res.status(500).json({ message: err.message });
  }
};

// Test endpoint: manually trigger webhook simulation (dev only)
exports.simulateWebhook = async (req, res) => {
  try {
    const { sessionId, bookingId } = req.body;
    if (!sessionId || !bookingId) {
      return res.status(400).json({ message: 'sessionId and bookingId required' });
    }

    // Simulate webhook for testing
    const booking = await Booking.findById(bookingId).populate('pet buyer owner');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Create payment record
    const amount = (booking.pet?.price || 100) * 100;
    const payment = await Payment.create({
      booking: bookingId,
      stripeSessionId: sessionId,
      amount,
      currency: 'usd',
      status: 'completed'
    });

    // Update booking & pet
    booking.status = 'approved';
    booking.paid = true;
    await booking.save();

    if (booking.pet) {
      booking.pet.status = 'adopted';
      await booking.pet.save();
    }

    // Notify buyer
    await Notification.create({
      user: booking.buyer._id,
      title: 'Payment successful — booking approved',
      body: `Your payment for ${booking.pet.name} succeeded and booking is approved.`,
      meta: { bookingId }
    });

    res.json({ ok: true, payment, booking });
  } catch (err) {
    console.error('simulateWebhook error', err);
    res.status(500).json({ message: err.message });
  }
};

// Fetch session details by Stripe sessionId (auth required)
exports.fetchSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ message: 'sessionId query param required' });

    // First try to get from Payment record
    const payment = await Payment.findOne({ stripeSessionId: sessionId }).populate({
      path: 'booking',
      populate: [
        { path: 'pet', select: 'name breed price' },
        { path: 'buyer', select: 'name email' }
      ]
    });

    if (payment) {
      return res.json({
        booking: payment.booking,
        payment: {
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          stripeSessionId: payment.stripeSessionId,
          createdAt: payment.createdAt
        }
      });
    }

    // If no payment record yet, try to fetch from Stripe directly
    // This handles the case where webhook hasn't fired yet
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Try to find booking from metadata
    const bookingId = session.metadata?.bookingId;
    let booking = null;
    if (bookingId) {
      booking = await Booking.findById(bookingId).populate([
        { path: 'pet', select: 'name breed price' },
        { path: 'buyer', select: 'name email' }
      ]);
    }

    res.json({
      booking: booking,
      payment: {
        amount: session.amount_total,
        currency: session.currency,
        status: session.payment_status === 'paid' ? 'completed' : 'pending',
        stripeSessionId: session.id,
        createdAt: session.created * 1000 // Convert Unix timestamp to ms
      }
    });
  } catch (err) {
    console.error('fetchSessionDetails error', err);
    res.status(500).json({ message: err.message });
  }
};

// Webhook endpoint: expects raw body and stripe signature header
// Webhook endpoint: expects raw body and stripe signature header
exports.handleWebhook = async (req, res) => {
  try {
    const stripe = getStripe();
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      // 👉 express.raw({ type: 'application/json' }) in server.js
      //    means req.body is the raw Buffer Stripe expects
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log('🔥 Webhook event received:', event.type);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      const stripeSessionId = session.id;
      const amount = session.amount_total || null;
      const currency = session.currency || 'usd';

      console.log('✅ Updating booking as PAID, bookingId =', bookingId);

      // create Payment record (optional, but nice to have)
      await Payment.create({
        booking: bookingId ? new mongoose.Types.ObjectId(bookingId) : null,
        stripeSessionId,
        amount,
        currency,
        status: 'completed'
      });

      // update booking & pet
      if (bookingId) {
        const booking = await Booking.findById(bookingId).populate('pet buyer owner');
        if (booking) {
          booking.status = 'approved';
          booking.paid = true;
          await booking.save();

          if (booking.pet) {
            booking.pet.status = 'adopted';
            await booking.pet.save();
          }

          // notify buyer
          await Notification.create({
            user: booking.buyer._id,
            title: 'Payment successful — booking approved',
            body: `Your payment for ${booking.pet.name} succeeded and booking is approved.`,
            meta: { bookingId }
          });

          // notify owner
          const ownerId = booking.owner?._id || booking.owner;
          if (ownerId) {
            await Notification.create({
              user: ownerId,
              title: 'Pet purchased',
              body: `${booking.buyer.name} completed payment for ${booking.pet.name}.`,
              meta: { bookingId }
            });
          }
        }
      }
    }

    // respond to Stripe
    res.json({ received: true });
  } catch (err) {
    console.error('webhook processing error', err);
    res.status(500).json({ message: 'Webhook handler error' });
  }
};

