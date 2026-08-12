/**
 * DLWYC backend — local development server.
 *
 * Serves the Registration Unit + RFID check-in/check-out flow (and minimal
 * user/admin/payment routes) using a JSON file store.
 *
 *   npm run dev   (backend only, port 4000)
 *   npm run dev   (at repo root)  — runs backend + frontend together
 */
import express from 'express';
import cors from 'cors';
import os from 'node:os';
import { load } from './store.js';
import { seedIfEmpty } from './seed.js';
import registrationUnitRoutes from './routes/registrationUnit.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import paymentRoutes from './routes/payment.js';

const PORT = parseInt(process.env.PORT || '4000', 10);

// Load + seed the store.
load();
seedIfEmpty();

const app = express();

// CORS: open by default so the web portal AND any network reader (e.g. the
// Raspberry Pi posting /rfid/scan from another machine) can reach the API.
// Restrict with CORS_ORIGINS (comma-separated) for production.
const corsOrigins = (process.env.CORS_ORIGINS || '*')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.includes('*') ? true : corsOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '2mb' }));

// Simple request logging.
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// API routes.
app.use('/api/registrationUnit', registrationUnitRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payment', paymentRoutes);

// Aliases used by the frontend.
app.use('/api/userLogin', userRoutes);
app.use('/api/userRegistration', userRoutes);
app.use('/api/userDashboard', userRoutes);
app.use('/api/userRegisteredEvents', userRoutes);

// Health check.
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// 404 for unknown API routes.
app.use('/api', (_req, res) => res.status(404).json({ message: 'Not found' }));

// Error handler.
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const host = '0.0.0.0';
app.listen(PORT, host, () => {
  // Print the LAN IP so other machines (e.g. a Raspberry Pi reader) can find it.
  const nets = os.networkInterfaces();
  const lan = Object.values(nets)
    .flat()
    .find((i) => i && i.family === 'IPv4' && !i.internal)?.address || 'localhost';

  console.log(`\nDLWYC backend listening on http://${host}:${PORT}`);
  console.log(`  Local (this machine): http://localhost:${PORT}/api/registrationUnit`);
  console.log(`  LAN   (other devices): http://${lan}:${PORT}/api/registrationUnit`);
  console.log(`  RFID scan toggle     : POST http://${lan}:${PORT}/api/registrationUnit/rfid/scan`);
  console.log(`  Scan history         : GET  http://${lan}:${PORT}/api/registrationUnit/rfid/logs\n`);
});
