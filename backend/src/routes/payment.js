/**
 * Payment routes (minimal functional implementation so the app works end to end).
 */
import { Router } from 'express';
import { db, save } from '../store.js';

const router = Router();

/** POST /api/payment/verify-code */
router.post('/verify-code', (req, res) => {
  const { paymentCode } = req.body || {};
  if (!paymentCode) return res.status(400).json({ message: 'Payment code required' });
  // In production this validates against Paystack/Flutterwave. Demo: accept any.
  return res.json({
    message: 'Code verified',
    valid: true,
    paymentStatus: 'success',
  });
});

/** GET /api/payment/payment-history/:uniqueId */
router.get('/payment-history/:uniqueId', (req, res) => {
  const uniqueId = req.params.uniqueId;
  const history = db.attendees
    .filter((a) => a.uniqueId === uniqueId || a.email === uniqueId)
    .map((a) => ({
      eventTitle: a.eventDetails?.eventTitle,
      paymentStatus: a.eventDetails?.paymentStatus,
      paymentTime: a.eventDetails?.paymentTime,
      amount: a.eventDetails?.amount || 5000,
      reference: `REF-${a.userId}`,
    }));
  res.json({ data: history });
});

/** POST /api/payment/initializeTransaction/ */
router.post('/initializeTransaction/', (_req, res) => {
  res.json({ message: 'Payment initialized (demo)', reference: `REF-${Date.now()}` });
});

/** POST /api/payment/verify-payment */
router.post('/verify-payment', (req, res) => {
  res.json({ message: 'Payment verified', status: 'success' });
});

/** POST /api/payment/generate-code */
router.post('/generate-code', (_req, res) => {
  res.json({ code: `DLW-${Math.random().toString(36).slice(2, 10).toUpperCase()}` });
});

/** POST /api/payment/save-codes */
router.post('/save-codes', (_req, res) => res.json({ message: 'Saved' }));

/** POST /api/payment/update-code-status */
router.post('/update-code-status', (_req, res) => res.json({ message: 'Updated' }));

export default router;
