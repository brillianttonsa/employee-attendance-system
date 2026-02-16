```

## Project status (updated)

- Added worker management UI improvements:
  - Paginated workers list (client-side) with page controls.
  - CSV export for the filtered worker list via "Export CSV" button.
  - Add worker dialog wired to refresh the list after creation.
  - Edit and Delete actions available in the row menu; delete confirms before calling API.
  - Mock data fallback when backend API is not available (useful for local UI preview).
  - Removed QR-code copy text and made `qr_code` optional in the `Worker` type.

- Files changed:
  - src/hooks/useWorkers.tsx — pagination, mock data, and API handling improvements.
  - src/components/dashboard/workers/WorkersList.tsx — export CSV, pagination UI, and filter wiring.
  - src/pages/dashboard/admin/WorkersPage.tsx — pass filters and handlers to the list; refresh after add.
  - src/components/dashboard/workers/AddWorkerDialog.tsx — removed QR text and added onComplete callback use.
  - src/types/worker.ts — made `qr_code` optional and exported types used across components.

Notes:
- The implementation uses client-side filtering/pagination and a mocked dataset when the API endpoints `/api/workers` and `/api/departments` are unreachable. When you have a running backend, the components will call the real endpoints.
- I kept the UI styling consistent with the existing tailwind classes; you can tweak `pageSize` in `useWorkers` if you prefer a different page size.


## Backend (eas-backend) — local setup

This repo includes a minimal Node/Express backend scaffold under `eas-backend` to support authentication and worker CRUD for local development.

Steps to run locally:

1. Ensure PostgreSQL is installed and running locally.
2. Create a database (example):

```bash
createdb easdev
```

3. Create a `.env` file in `eas-backend` with the following variables (adjust as needed):

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/easdev
JWT_SECRET=your_jwt_secret_here
PORT=4000
```

4. Initialize the database schema and seed data:

```bash
# from the project root
psql "$DATABASE_URL" -f eas-backend/db/init.sql
```

5. Install backend dependencies and start the server:

```bash
cd eas-backend
npm install
npm run start
```

API endpoints (examples):

- `POST /api/auth/login` — body: `{ email, password }` returns `{ token, user }`.
- `GET /api/departments` — list departments.
- `GET /api/workers` — list workers (joined with department name).
- `POST /api/workers` — create worker.
- `PATCH /api/workers/:id` — update worker.
- `DELETE /api/workers/:id` — delete worker.

Notes:
- The seed SQL contains an admin user with email `admin@example.com` and a bcrypt placeholder hash. Replace that hash with a bcrypt hash for a password you control or create a user via SQL.
- The backend is intentionally minimal and meant for development. For production usage, add input validation, rate limiting, proper password hashing and salting in a secure flow, and HTTPS.

## Attendance & QR Code System

The system includes an attendance tracking feature using QR codes:

### Sessions & QR Codes
- **Temporary QR Code**: Expires after a set time (e.g., 30 minutes) for on-time arrivals
- **Static QR Code**: Permanent code for employees who arrive late and miss the temporary window

### Frontend Pages

- **ScanPage** (`src/pages/ScanPage.tsx`): Displays both QR codes with real-time countdown timer. Shows today's check-in statistics.
- **SessionsPage** (`src/pages/dashboard/admin/SessionsPage.tsx`): Admin panel to create and manage attendance sessions
- **AttendancePage** (`src/pages/dashboard/admin/AttendancePage.tsx`): View all attendance records with on-time/late status
- **EmployeeDashboard** (`src/pages/dashboard/employee/EmployeeDashboard.tsx`): Employee view showing their own attendance history and punctuality stats

### Backend API Endpoints

**Sessions:**
- `GET /api/sessions` — list all sessions
- `POST /api/sessions` — create new session (body: `{ expires_in_minutes }`)
- `POST /api/sessions/:sessionId/checkin` — record attendance (body: `{ worker_id, qr_code }`)

**Attendances:**
- `GET /api/attendances` — list all attendance records
- `GET /api/attendances/worker/:workerId` — get specific worker's attendance
- `GET /api/attendances/session/:sessionId` — get session's attendance records

### Database Schema

Two new tables are created by `init.sql`:
- `attendance_sessions` — stores session info with temp/static QR codes
- `attendance_records` — stores individual employee check-ins

