# Pet Adoption Backend

1. Copy `.env.example` to `.env` and fill values.
2. `npm install`
3. `npm run dev` (requires nodemon) or `npm start`
4. API runs on PORT (default 5000). Socket.io listens alongside server.

Endpoints:
- /api/auth/register
- /api/auth/login
- /api/pets
- /api/bookings
- /api/chats (socket.io)
- etc.

Notes:
- For file uploads (photos, medical docs) integrate cloud storage (S3 / Cloudinary).
- For payments, integrate Stripe/Razorpay in frontend and use /api/payments endpoints for server-side recording and webhooks.
