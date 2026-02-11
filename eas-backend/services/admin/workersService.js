import { query } from '../../db/index.js';
import bcrypt from 'bcryptjs';

export async function getAllWorkers() {
  const r = await query(`
    SELECT w.*, d.name as department_name
    FROM workers w
    LEFT JOIN departments d ON d.id = w.department_id
    ORDER BY w.id DESC
  `);
  return r.rows;
}

export async function findWorkerByEmail(email) {
  const r = await query('SELECT id FROM workers WHERE email = $1', [email]);
  return r.rows[0];
}

export async function createWorker({ first_name, last_name, email, phone, department_id, position, hire_date }) {
  const employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
  // Use last_name as initial password, hashed
  const initialPassword = String(last_name || '').trim();
  const hashedPassword = await bcrypt.hash(initialPassword, 10);

  const r = await query(
    `INSERT INTO workers (employee_id, first_name, last_name, email, phone, department_id, position, password, hire_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [employeeId, first_name, last_name, email, phone || null, department_id || null, position || null, hashedPassword, hire_date || null]
  );
  return r.rows[0];
}

export async function updateWorker(id, fieldsObj) {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key of ['first_name','last_name','email','phone','department_id','position','status','hire_date']) {
    if (fieldsObj[key] !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(fieldsObj[key]);
    }
  }
  if (!fields.length) return null;
  values.push(id);
  const r = await query(`UPDATE workers SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
  return r.rows[0];
}

export async function deleteWorker(id) {
  await query('DELETE FROM workers WHERE id = $1', [id]);
  return true;
}

export default { getAllWorkers, findWorkerByEmail, createWorker, updateWorker, deleteWorker };
