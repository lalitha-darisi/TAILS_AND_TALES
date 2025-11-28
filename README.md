# Pet Adoption

Simple pet adoption marketplace: Node/Express backend and React (Vite) frontend.

**Contents**
- `backend/` — Express API, MongoDB models, Stripe integration
- `frontend/` — React app (Vite)

**Ports**
- Backend (dev): `http://localhost:5000` (configurable via `backend/.env` `PORT`)
- Frontend (dev): `http://localhost:5173` (Vite default; configurable)

## Prerequisites
- Node.js (>=16) and npm
- MongoDB connection string (Atlas or local)
- (Optional) Stripe account and webhook secret if you use payments

## Environment
Copy or create `backend/.env` with values similar to the repo example. Required values used by the app:
```
PORT=5000
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<jwt-secret>
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@petapp.local
ADMIN_PASSWORD=AdminPass123
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=<stripe-secret-if-used>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret-if-used>
```

Notes:
- `FRONTEND_URL` is used for CORS and Stripe success/cancel URLs (dev default: `http://localhost:5173`).
- Do not commit secrets to source control.

## Install & Run (development)
Open two terminals (or use your favourite multiplexer).

Backend (PowerShell):
```powershell
cd backend
npm install
# start dev server with nodemon
npm run dev
# or to run without nodemon
npm start
```

Frontend (PowerShell):
```powershell
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

## Seed sample data
There is a seeding script to create an admin and a couple of sample pets:
```powershell
cd backend
node scripts/seed.js
```
The seeder reads `backend/.env` for the `MONGO_URI` and admin credentials.

## API summary
Base API prefix: `/api`
- `GET /` — Root health (`http://localhost:5000/`)
- `POST /api/auth/...` — Authentication endpoints
- `GET/POST /api/users` — Users
- `GET/POST /api/pets` — Pets
- `POST /api/bookings` — Bookings
- `POST /api/payments/webhook` — Stripe webhook (expects raw body)
- And routes for chats, notifications, reviews, medical records, admin operations in `backend/src/routes/`

Important: Stripe webhook route requires `express.raw({ type: 'application/json' })` so the server must receive the raw request body for signature verification. When registering a webhook in Stripe, point it at: `http://<your-host>:5000/api/payments/webhook`.

## Frontend
- Built with React + Vite.
- API client uses `axios` in `frontend/src/api/api.js` (ensure the base URL points to your backend if you run frontend separately from backend). If you want, I can add a `VITE_API_URL` env var and wire it into the client.
- I added a `Price (USD)` field to the Create Pet form so owners can enter `price` when creating a listing. The backend `Pet` model already stores `price` as a `Number`.

## Build & Preview (production)
Frontend:
```powershell
cd frontend
npm run build
npm run preview
```
Backend: run `npm start` (ensure `NODE_ENV=production` and suitable process manager / reverse proxy in front for production).

## Notes & Tips
- Use `nodemon` (already in `backend/devDependencies`) for automatic server reloads during development (`npm run dev`).
- Use `postman`/`curl` to test endpoints.
- If Vite selects a different port than `5173` (because it's in use), update `backend/.env` `FRONTEND_URL` if needed.

## Troubleshooting
- Connection errors: confirm `MONGO_URI` in `backend/.env` and that the DB is reachable.
- Stripe errors: ensure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are set. For local webhook testing, consider using `stripe cli` to forward webhooks.

## Want me to add?
- Single root script to `npm install` + start both services.
- `VITE_API_URL` wiring to the frontend `axios` client.
- Dockerfile(s) and `docker-compose` for local development.

---
Generated README by repository automation — edit as needed.
