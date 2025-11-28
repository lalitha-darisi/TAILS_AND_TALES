require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./src/config/db');

const adminRoutes = require('./src/routes/adminRoutes');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const petRoutes = require('./src/routes/petRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const medicalRoutes = require('./src/routes/medicalRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

const { initSocket } = require('./src/controllers/chatController');
const paymentController = require('./src/controllers/paymentController');

const app = express();
const server = http.createServer(app);

connectDB();

/* -----------------------------------------
   1️⃣ STRIPE WEBHOOK — RAW BODY REQUIRED
----------------------------------------- */
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    paymentController.handleWebhook(req, res, next);
  }
);

/* -----------------------------------------
   2️⃣ JSON PARSER AFTER WEBHOOK
----------------------------------------- */
app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

/* -----------------------------------------
   3️⃣ NORMAL API ROUTES
----------------------------------------- */
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => res.send({ ok: true, message: 'Pet Adoption API' }));

/* -----------------------------------------
   4️⃣ SOCKET.IO
----------------------------------------- */
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.use((socket, next) => {
  console.log('Socket handshake attempt:', {
    id: socket.id,
    url: socket.handshake.url,
    auth: socket.handshake.auth,
    headers: socket.handshake.headers && {
      origin: socket.handshake.headers.origin,
      referer: socket.handshake.headers.referer
    }
  });
  next();
});

initSocket(io);

/* -----------------------------------------
   5️⃣ START SERVER
----------------------------------------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
