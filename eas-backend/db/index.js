import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

// const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/easdev';
// const pool = new Pool({ connectionString });
const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME
});

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

export default pool;
