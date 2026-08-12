/**
 * User auth + dashboard routes (minimal, functional implementation).
 */
import { Router } from 'express';
import { db, save } from '../store.js';

const router = Router();

let seq = 0;
const uid = (p) => {
  seq += 1;
  const t = Date.now().toString(36).toUpperCase().slice(-6);
  const s = seq.toString(36).toUpperCase().padStart(4, '0');
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${p}${t}${s}${r}`;
};

function findUserByToken(req) {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (!token.startsWith('U.')) return null;
  const decoded = Buffer.from(token.slice(2), 'base64').toString('utf8');
  return db.users.find((u) => u.userId === decoded) || null;
}

/** POST /api/userLogin */
router.post('/userLogin', (req, res) => {
  const { email, password } = req.body || {};
  const user = db.users.find(
    (u) => u.email?.toLowerCase() === (email || '').toLowerCase() && u.password === password
  );
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password', errors: 'Invalid credentials' });
  }
  const token = `U.${Buffer.from(user.userId).toString('base64')}`;
  return res.json({ token, message: 'Login successful' });
});

/** POST /api/userRegistration */
router.post('/userRegistration', (req, res) => {
  const body = req.body || {};
  if (!body.email) return res.status(400).json({ message: 'Email is required', errors: 'Validation failed' });
  const existing = db.users.find((u) => u.email?.toLowerCase() === body.email.toLowerCase());
  if (existing) return res.status(409).json({ message: 'Account already exists' });

  const user = {
    userId: uid('U'),
    fullName: body.fullName || body.name || 'New User',
    email: body.email,
    password: body.password || 'password123',
    phone: body.phone || '',
    gender: body.gender || 'male',
    uniqueId: body.uniqueId || '',
    archdeaconry: body.archdeaconry || '',
  };
  db.users.push(user);
  save();
  const token = `U.${Buffer.from(user.userId).toString('base64')}`;
  return res.status(201).json({ message: 'Registration successful', token, data: user });
});

/** GET /api/userDashboard  (auth required) */
router.get('/userDashboard', (req, res) => {
  const user = findUserByToken(req);
  if (!user) return res.status(401).json({ message: 'Invalid token' });
  const registrations = db.attendees.filter((a) => a.email?.toLowerCase() === user.email.toLowerCase());
  return res.json({
    data: {
      ...user,
      password: undefined,
      registeredEvents: registrations.map((r) => ({ ...r.eventDetails, uniqueId: r.uniqueId, userId: r.userId })),
    },
  });
});

/** GET /api/userRegisteredEvents/:userId */
router.get('/userRegisteredEvents/:userId', (req, res) => {
  const userId = req.params.userId;
  const attendee = db.attendees.find((a) => a.userId === userId || a.uniqueId === userId);
  if (!attendee) return res.status(404).json({ message: 'No registrations found', data: [] });
  res.json({ data: [toView(attendee)] });
});

function toView(a) {
  return { ...a, password: undefined };
}

export default router;
