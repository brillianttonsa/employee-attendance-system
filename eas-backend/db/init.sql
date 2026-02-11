-- init.sql: creates tables and seeds minimal data for local development

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'admin'
);

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS workers (
  id SERIAL PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  position TEXT NOT NULL,
  password TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  hire_date DATE
);

CREATE TABLE IF NOT EXISTS attendance_sessions (
  id SERIAL PRIMARY KEY,
  qr_code_temp TEXT UNIQUE NOT NULL,
  qr_code_static TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  worker_name TEXT NOT NULL,
  session_id INTEGER NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  scan_time TIMESTAMP DEFAULT NOW(),
  is_late BOOLEAN DEFAULT false
);

-- -- seed departments
-- INSERT INTO departments (name) VALUES
--   ('Engineering'), ('HR'), ('Sales')
-- ON CONFLICT DO NOTHING;

-- -- seed an admin user
-- -- Email: admin@example.com
-- -- Password: password (bcrypt hash below)
-- -- To generate a new hash, use: bcryptjs.hash('your_password', 10)
-- -- Example: const hash = await bcrypt.hash('password', 10);
-- INSERT INTO users (email, password_hash, first_name, last_name, role)
--   VALUES ('admin@example.com', '$2a$10$vkq1VmV/eVPV5AO8kGxSmO/6MAmjXB5qCMr7XGDVF5wFDz2DeRiEm', 'Admin', 'User', 'admin')
-- ON CONFLICT DO NOTHING;

