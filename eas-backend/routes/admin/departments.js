import express from 'express';
import { verifyAuth } from '../../middleware/auth.js';
import * as departmentsService from '../../services/admin/departmentsService.js';

const router = express.Router();

// GET all departments - requires auth
router.get('/', verifyAuth, async (req, res) => {
  try {
    const rows = await departmentsService.getAllDepartments();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new department - requires auth
router.post('/', verifyAuth, async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Department name is required' });

  try {
    const created = await departmentsService.createDepartment(name);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Department already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
