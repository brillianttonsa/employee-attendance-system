import { useAttendanceSessions } from "../../../hooks/useAttendanceSessions";
import { SessionsList } from "../../../components/dashboard/attendance/SessionsList";

export default function SessionsPage() {
  const { sessions, currentSession, isLoading, createNewSession } = useAttendanceSessions();

  return (
    <div className="max-w-7xl py-4 mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance Sessions</h1>
        <p className="text-muted-foreground mt-1">
          Manage QR code sessions for employee attendance tracking
        </p>
      </div>

      <SessionsList
        sessions={sessions}
        currentSession={currentSession}
        onCreateNew={createNewSession}
        isLoading={isLoading}
      />
    </div>
  );
}
