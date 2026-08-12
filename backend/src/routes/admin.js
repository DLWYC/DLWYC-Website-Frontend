/**
 * Admin routes (used by the super-admin pages).
 */
import { Router } from 'express';
import { db } from '../store.js';

const router = Router();

/** GET /api/admin/events — events with registration counts. */
router.get('/events', (_req, res) => {
  const data = db.events.map((e) => ({
    ...e,
    registeredCount: db.attendees.filter((a) => a.eventDetails?.eventTitle === e.eventTitle).length,
    checkedInCount: db.attendees.filter(
      (a) => a.eventDetails?.eventTitle === e.eventTitle && a.eventDetails.checkedInStatus
    ).length,
  }));
  res.json({ data });
});

export default router;
