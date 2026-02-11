import { query } from '../../db/index.js';

export async function getAllSessions() {
  const r = await query('SELECT * FROM attendance_sessions ORDER BY created_at DESC');
  return r.rows;
}

export async function createSession(expires_in_minutes = 30) {
  const tempCode = `SESSION_${Date.now()}_TEMP`;
  const staticCode = `SESSION_${Date.now()}_STATIC`;
  const expiresAt = new Date(Date.now() + expires_in_minutes * 60000);

  const r = await query(
    `INSERT INTO attendance_sessions (qr_code_temp, qr_code_static, created_at, expires_at, status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [tempCode, staticCode, new Date(), expiresAt, 'active']
  );
  return r.rows[0];
}

export async function checkin(sessionId, worker_id, qr_code) {
  if (!worker_id) throw new Error('Worker ID required');

  const sessionRes = await query('SELECT * FROM attendance_sessions WHERE id = $1', [sessionId]);
  if (!sessionRes.rows.length) throw Object.assign(new Error('Session not found'), { status: 404 });

  const session = sessionRes.rows[0];
  const now = new Date();
  const isLate = new Date(session.expires_at) < now && qr_code === session.qr_code_temp;

  const workerRes = await query('SELECT first_name, last_name FROM workers WHERE id = $1', [worker_id]);
  if (!workerRes.rows.length) throw Object.assign(new Error('Worker not found'), { status: 404 });
  const worker = workerRes.rows[0];

  const r = await query(
    `INSERT INTO attendance_records (worker_id, session_id, scan_time, is_late, worker_name)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [worker_id, sessionId, now, isLate, `${worker.first_name} ${worker.last_name}`]
  );
  return r.rows[0];
}

export default { getAllSessions, createSession, checkin };
