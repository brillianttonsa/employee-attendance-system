import express from 'express';
import { verifyAuth } from '../../middleware/auth.js';
import * as workersService from '../../services/admin/workersService.js';

const router = express.Router();

// GET all workers - requires auth
router.get('/', verifyAuth, async (req, res) => {
  try {
    const rows = await workersService.getAllWorkers();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new worker - requires auth
router.post('/', verifyAuth, async (req, res) => {
  const { first_name, last_name, email, phone, department_id, position, hire_date } = req.body;
  if (!first_name || !last_name || !email) return res.status(400).json({ error: 'Missing required fields' });

  try {
    // check existing
    const existing = await workersService.findWorkerByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'A worker with that email already exists' });
    }

    const created = await workersService.createWorker({ first_name, last_name, email, phone, department_id, position, hire_date });
    res.status(201).json(created);
  } catch (err) {
    console.error('Create worker error:', err);
    if (err && err.code === '23505') return res.status(409).json({ error: 'Resource already exists' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH worker - requires auth
router.patch('/:id', verifyAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await workersService.updateWorker(id, req.body);
    if (!updated) return res.status(400).json({ error: 'No fields to update' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    if (err && err.code === '23505') return res.status(409).json({ error: 'A worker with that email already exists' });
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE worker - requires auth
router.delete('/:id', verifyAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await workersService.deleteWorker(id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
