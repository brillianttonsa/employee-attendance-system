import { query } from '../../db/index.js';

export async function getAllDepartments() {
  const r = await query('SELECT * FROM departments ORDER BY id');
  return r.rows;
}

export async function createDepartment(name) {
  const r = await query('INSERT INTO departments (name) VALUES ($1) RETURNING *', [name]);
  return r.rows[0];
}

export default { getAllDepartments, createDepartment };
