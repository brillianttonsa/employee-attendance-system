import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../db/index.js';
import { verifyAuth } from '../../middleware/auth.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = '8h';

// POST /login - Authenticate admin/user and set JWT cookie
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const result = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });

    // Return user info (without password)
    res.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /employee-login - Authenticate employee/worker and set JWT cookie
router.post('/employee-login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const result = await query('SELECT * FROM workers WHERE email = $1 LIMIT 1', [email]);
    const worker = result.rows[0];
    if (!worker) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, worker.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token with worker role
    const token = jwt.sign(
      { sub: worker.id, email: worker.email, role: 'employee', type: 'worker' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });

    // Return worker info (without password)
    res.json({
      user: {
        id: worker.id,
        email: worker.email,
        first_name: worker.first_name,
        last_name: worker.last_name,
        employee_id: worker.employee_id,
        department_id: worker.department_id,
        role: 'employee',
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /me - Get current user from token
router.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // In production, you might fetch user from DB here to ensure they still exist
    res.json({
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /logout - Clear authentication cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ ok: true });
});

export default router;
