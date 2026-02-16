# EAS (Employee Attendance System) - Setup & Running Guide

## Overview

This is a full-stack Employee Attendance System with QR-code-based attendance tracking. It consists of:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

## Database Setup

### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL as admin
psql -U postgres

# Create the database
CREATE DATABASE eas_dev;

# Exit psql
\q
```

### 2. Initialize Database Schema

```bash
# Navigate to backend directory
cd eas-backend

# Run the initialization SQL
psql -U postgres -d eas_dev -f db/init.sql
```

This will:
- Create all required tables (users, departments, workers, attendance_sessions, attendance_records)
- Seed 3 departments (Engineering, HR, Sales)
- Create an admin user

**Demo Admin Credentials:**
- Email: `admin@example.com`
- Password: `password`

### 3. Verify Database Connection

Update `.env` in `eas-backend/` if your PostgreSQL credentials differ:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/eas_dev
```

## Backend Setup

### 1. Install Dependencies

```bash
cd eas-backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update if needed:

```bash
cp .env.example .env
```

Default `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eas_dev
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=dev_secret_key_change_in_production
```

### 3. Start Backend Server

```bash
npm run dev
```

Server runs on `http://localhost:4000`

## Frontend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the root directory:

```env
VITE_API_URL=http://localhost:4000
```

(Or copy from `.env.example`)

### 3. Start Frontend Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Running the Full Application

### Terminal 1: Backend

```bash
cd eas-backend
npm run dev
```

### Terminal 2: Frontend

```bash
npm run dev
```

### Access the Application

1. Open http://localhost:5173 in your browser
2. Login with demo credentials:
   - Email: `admin@example.com`
   - Password: `password`
3. Navigate through admin dashboard to manage workers, departments, attendance sessions, and view reports

## Key Features

### Admin Features
- **Workers Management**: Add, edit, delete employees
- **Departments**: Manage company departments
- **Attendance Sessions**: Create QR code sessions (temporary 30-min codes + static codes for latecomers)
- **Reports**: View attendance metrics and analytics
- **Settings**: Update profile, password, preferences

### Attendance Tracking
- **ScanPage** (`/scan`): Public page displaying active QR codes for employee check-in
- **Attendance Records**: Admin can view all employee check-ins with status (on-time/late)
- **Employee Dashboard**: Employees can view their personal attendance history and punctuality stats

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and receive JWT cookie
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout and clear cookie

### Workers
- `GET /api/workers` - List all workers
- `POST /api/workers` - Create new worker
- `PATCH /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker

### Departments
- `GET /api/departments` - List all departments
- `POST /api/departments` - Create new department

### Attendance Sessions
- `GET /api/sessions` - List all sessions
- `POST /api/sessions` - Create new session
- `POST /api/sessions/:sessionId/checkin` - Record attendance

### Attendance Records
- `GET /api/attendances` - List all attendance records
- `GET /api/attendances/worker/:workerId` - Get specific worker's attendance
- `GET /api/attendances/session/:sessionId` - Get session's attendance records

## Authentication & Security

All endpoints (except login) require JWT authentication via HttpOnly cookies:
- Login returns an HttpOnly, Secure cookie with JWT token
- Cookies are automatically sent with all requests (`withCredentials: true`)
- Cookie expires in 8 hours
- Token includes: user ID, email, and role

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running:
```bash
# macOS
brew services start postgresql

# Windows (if installed as service)
net start postgresql-x64-14

# Linux
sudo systemctl start postgresql
```

### Port Already in Use
**Backend (4000)**:
```bash
lsof -i :4000
kill -9 <PID>
```

**Frontend (5173)**:
Update in `vite.config.ts` or use:
```bash
npm run dev -- --port 3000
```

### CORS Errors
Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL.

### API Not Authenticating
- Clear browser cookies
- Logout and login again
- Check that `withCredentials: true` is set in API requests

## Development Tips

1. **Mock Data Removed**: Frontend now depends entirely on backend API. Must be logged in to access data.

2. **Error Handling**: Check browser console and server logs for detailed error messages.

3. **Database Reset**: 
   - Drop and recreate database: `dropdb eas_dev && createdb eas_dev && psql -U postgres -d eas_dev -f db/init.sql`
   - Or truncate tables and reinitialize

4. **Add Seed Data**: 
   - Manually create workers/departments via API or UI
   - Or create SQL INSERT statements in `db/init.sql`

## Project Structure

```
.
├── src/
│   ├── pages/
│   │   ├── auth/
│   │   │   └── login.tsx
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   │   ├── WorkersPage.tsx
│   │   │   │   ├── DepartmentsPage.tsx
│   │   │   │   ├── SessionsPage.tsx
│   │   │   │   ├── AttendancePage.tsx
│   │   │   │   ├── ReportsPage.tsx
│   │   │   │   └── SettingsPage.tsx
│   │   │   └── employee/
│   │   │       └── EmployeeDashboard.tsx
│   │   └── ScanPage.tsx
│   ├── hooks/
│   │   ├── useWorkers.tsx
│   │   ├── useDepartments.tsx
│   │   ├── useReports.tsx
│   │   └── useAttendanceSessions.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── AuthRoute.tsx
│   ├── service/
│   │   └── api.ts
│   └── components/
│       └── dashboard/
│           ├── workers/
│           ├── departments/
│           ├── attendance/
│           └── ...
├── eas-backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── workers.js
│   │   ├── departments.js
│   │   ├── sessions.js
│   │   └── attendances.js
│   ├── db/
│   │   ├── index.js
│   │   └── init.sql
│   ├── server.js
│   ├── .env
│   └── package.json
└── README.md
```

## Next Steps

1. Create more seed data (workers, departments, attendance sessions)
2. Implement QR code scanning with camera
3. Add role-based access control (admin vs employee vs manager)
4. Setup production environment deployment
5. Add unit and integration tests

## Support

For issues or questions, check:
- Browser console for client-side errors
- Server logs for backend errors
- Database credentials and connection
- Network tab in DevTools for API calls
