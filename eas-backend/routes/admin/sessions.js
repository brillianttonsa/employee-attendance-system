import express from 'express';
import { verifyAuth } from '../../middleware/auth.js';
import * as sessionsService from '../../services/admin/sessionsService.js';

const router = express.Router();

// Get all sessions - requires auth
router.get('/', verifyAuth, async (req, res) => {
  try {
    const rows = await sessionsService.getAllSessions();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new session - requires auth
router.post('/', verifyAuth, async (req, res) => {
  const { expires_in_minutes = 30 } = req.body;
  try {
    const created = await sessionsService.createSession(expires_in_minutes);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check in (scan QR code) - requires auth
router.post('/:sessionId/checkin', verifyAuth, async (req, res) => {
  const { sessionId } = req.params;
  const { worker_id, qr_code } = req.body;

  try {
    const record = await sessionsService.checkin(sessionId, worker_id, qr_code);
    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    if (err.status === 404) return res.status(404).json({ error: err.message });
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
