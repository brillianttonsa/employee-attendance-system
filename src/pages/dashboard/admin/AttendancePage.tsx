import { Suspense } from "react";
import { useAttendanceSessions } from "../../../hooks/useAttendanceSessions";
import { AttendancesList } from "../../../components/dashboard/attendance/AttendancesList";

function AttendancesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-slate-200 rounded-2xl p-6 h-32"></div>
        ))}
      </div>
      <div className="bg-slate-200 rounded-2xl p-8 h-80"></div>
    </div>
  );
}

export default function AttendancePage() {
  const { attendances, isLoading } = useAttendanceSessions();

  return (
    <div className="max-w-7xl py-4 mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Attendance Records</h1>
        <p className="text-muted-foreground mt-1">
          View employee attendance and check-in times
        </p>
      </div>

      <Suspense fallback={<AttendancesLoading />}>
        {isLoading ? <AttendancesLoading /> : <AttendancesList attendances={attendances} />}
      </Suspense>
    </div>
  );
}
