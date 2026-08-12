/**
 * Registration Unit + RFID check-in / check-out routes.
 */
import { Router } from 'express';
import { db, save, normalizeUid, logRfidScan } from '../store.js';

const router = Router();

/** Convert a stored attendee into the shape the frontend expects. */
function toAttendeeView(a) {
  return {
    userId: a.userId,
    fullName: a.fullName,
    uniqueId: a.uniqueId,
    email: a.email,
    phone: a.phone,
    gender: a.gender,
    cardUID: a.cardUID || a.rfidTag || '',
    rfidTag: a.rfidTag || a.cardUID || '',
    createdAt: a.createdAt,
    eventDetails: a.eventDetails || {},
  };
}

/** GET /api/registrationUnit/auth */
router.post('/auth', (req, res) => {
  const { email, password } = req.body || {};
  const admin = db.admins.find(
    (a) => a.email?.toLowerCase() === (email || '').toLowerCase() && a.password === password
  );
  if (!admin) {
    return res.status(401).json({ message: 'Invalid email or password', errors: 'Invalid credentials' });
  }
  const token = `ru.${Buffer.from(admin._id).toString('base64')}`;
  return res.json({
    message: 'Login successful',
    token,
    admin: { name: admin.name, email: admin.email, role: admin.role },
  });
});

/** GET /api/registrationUnit/allEvents */
router.get('/allEvents', (_req, res) => {
  res.json({ events: db.events });
});

/**
 * GET /api/registrationUnit/eventAttendees/:eventTitle
 * Returns attendees (with their assigned cardUID) for an event.
 */
router.get('/eventAttendees/:eventTitle', (req, res) => {
  const eventTitle = decodeURIComponent(req.params.eventTitle);
  const data = db.attendees
    .filter((a) => a.eventDetails?.eventTitle === eventTitle)
    .map(toAttendeeView);
  return res.json({ data });
});

/** PATCH /api/registrationUnit/eventAttendees/:userId/checkIn */
router.patch('/eventAttendees/:userId/checkIn', (req, res) => {
  const { userId } = req.params;
  const { eventTitle } = req.body || {};
  const attendee = db.attendees.find((a) => a.userId === userId);
  if (!attendee) return res.status(404).json({ message: 'Attendee not found' });

  attendee.eventDetails.checkedInStatus = true;
  if (eventTitle && attendee.eventDetails.eventTitle !== eventTitle) {
    attendee.eventDetails.eventTitle = eventTitle;
  }
  save();
  return res.json({ message: 'Checked in', data: toAttendeeView(attendee) });
});

/** PATCH /api/registrationUnit/eventAttendees/:userId/undoCheckIn */
router.patch('/eventAttendees/:userId/undoCheckIn', (req, res) => {
  const { userId } = req.params;
  const { eventTitle } = req.body || {};
  const attendee = db.attendees.find((a) => a.userId === userId);
  if (!attendee) return res.status(404).json({ message: 'Attendee not found' });

  attendee.eventDetails.checkedInStatus = false;
  if (eventTitle && attendee.eventDetails.eventTitle !== eventTitle) {
    attendee.eventDetails.eventTitle = eventTitle;
  }
  save();
  return res.json({ message: 'Check-in reversed', data: toAttendeeView(attendee) });
});

/** PATCH /api/registrationUnit/eventAttendees/:userId/rfid  (assign card to user) */
router.patch('/eventAttendees/:userId/rfid', (req, res) => {
  const { userId } = req.params;
  const uid = normalizeUid(req.body?.cardUID || req.body?.rfidTag || '');
  if (!uid) return res.status(400).json({ message: 'A valid cardUID is required' });

  const attendee = db.attendees.find((a) => a.userId === userId);
  if (!attendee) return res.status(404).json({ message: 'Attendee not found' });

  // Prevent assigning a card that's already bound to someone else.
  const existing = db.attendees.find(
    (a) => a.userId !== userId && normalizeUid(a.cardUID || a.rfidTag) === uid
  );
  if (existing) {
    return res.status(409).json({
      message: `Card already assigned to ${existing.fullName}`,
      owner: existing.fullName,
    });
  }

  attendee.cardUID = uid;
  attendee.rfidTag = uid;
  save();
  return res.json({ message: 'Card assigned', data: toAttendeeView(attendee) });
});

/**
 * POST /api/registrationUnit/rfid/scan
 * Used by the Raspberry Pi reader service (toggle mode). Resolves the UID to
 * an attendee and toggles their check-in/check-out for the given event.
 */
router.post('/rfid/scan', (req, res) => {
  const uid = normalizeUid(req.body?.cardUID || '');
  const eventTitle = req.body?.eventTitle || '';

  if (!uid) return res.status(400).json({ message: 'A valid cardUID is required' });

  const attendee = db.attendees.find(
    (a) => normalizeUid(a.cardUID || a.rfidTag) === uid
  );

  if (!attendee) {
    logRfidScan({ uid, eventTitle, action: 'unknown', message: 'No attendee for card' });
    return res.status(404).json({ message: 'No attendee found for this card', action: 'unknown' });
  }

  // If an event is given and the attendee isn't registered for it, still act
  // on the current status (the desktop portal scopes the list to an event).
  const toggled = !attendee.eventDetails?.checkedInStatus;
  attendee.eventDetails.checkedInStatus = toggled;
  if (eventTitle) attendee.eventDetails.eventTitle = eventTitle;
  save();

  const action = toggled ? 'checkedIn' : 'checkedOut';
  logRfidScan({ uid, eventTitle, action, userId: attendee.userId, fullName: attendee.fullName });
  return res.json({ message: `Checked ${toggled ? 'in' : 'out'}`, action, data: toAttendeeView(attendee) });
});

/** GET /api/registrationUnit/rfid/logs  (optional — recent scan history) */
router.get('/rfid/logs', (_req, res) => {
  res.json({ data: db.rfidLogs.slice(0, 50) });
});

export default router;
