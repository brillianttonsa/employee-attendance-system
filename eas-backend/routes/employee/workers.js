import express from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/index.js';


const router = express.Router();

// PATCH worker password - employee can change their own password
router.patch('/:id/change-password', async (req, res) => {
  const { id } = req.params;
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res.status(400).json({ error: 'Current and new password required' });
  }

  try {
    // Fetch worker by ID
    const workerRes = await query('SELECT * FROM workers WHERE id = $1', [id]);
    if (!workerRes.rows.length) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const worker = workerRes.rows[0];

    // Verify current password
    const match = await bcrypt.compare(current_password, worker.password);
    if (!match) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(new_password, 10);
    const r = await query('UPDATE workers SET password = $1 WHERE id = $2 RETURNING id, email, first_name, last_name', [hashedPassword, id]);

    res.json({ ok: true, message: 'Password updated successfully', worker: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
