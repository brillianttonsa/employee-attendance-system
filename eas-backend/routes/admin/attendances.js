import express from 'express';
import { verifyAuth } from '../../middleware/auth.js';
import * as attendancesService from '../../services/admin/attendancesService.js';

const router = express.Router();

// Get all attendance records - requires auth
router.get('/', verifyAuth, async (req, res) => {
  try {
    const rows = await attendancesService.getAllAttendances();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get attendance for specific worker - requires auth
router.get('/worker/:workerId', verifyAuth, async (req, res) => {
  const { workerId } = req.params;
  try {
    const rows = await attendancesService.getAttendancesByWorker(workerId);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get attendance for specific session - requires auth
router.get('/session/:sessionId', verifyAuth, async (req, res) => {
  const { sessionId } = req.params;
  try {
    const rows = await attendancesService.getAttendancesBySession(sessionId);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
