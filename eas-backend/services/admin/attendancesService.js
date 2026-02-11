import { query } from '../../db/index.js';

export async function getAllAttendances() {
  const r = await query(
    `SELECT ar.*, w.first_name, w.last_name, 
            CONCAT(w.first_name, ' ', w.last_name) as worker_name
     FROM attendance_records ar
     JOIN workers w ON w.id = ar.worker_id
     ORDER BY ar.scan_time DESC`
  );
  return r.rows;
}

export async function getAttendancesByWorker(workerId) {
  const r = await query(`SELECT * FROM attendance_records WHERE worker_id = $1 ORDER BY scan_time DESC`, [workerId]);
  return r.rows;
}

export async function getAttendancesBySession(sessionId) {
  const r = await query(
    `SELECT ar.*, CONCAT(w.first_name, ' ', w.last_name) as worker_name
     FROM attendance_records ar
     JOIN workers w ON w.id = ar.worker_id
     WHERE ar.session_id = $1
     ORDER BY ar.scan_time DESC`,
    [sessionId]
  );
  return r.rows;
}

export default { getAllAttendances, getAttendancesByWorker, getAttendancesBySession };
