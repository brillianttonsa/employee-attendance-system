import { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../service/api";
import type { AttendanceRecord } from "../../../types/attendance";

interface EmployeeAttendance {
  date: string;
  scanTime: string;
  isLate: boolean;
  sessionId: number;
}

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [attendances, setAttendances] = useState<{
    date: string;
    scanTime: string;
    isLate: boolean;
    sessionId: number;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todayScanned, setTodayScanned] = useState(false);

  useEffect(() => {
    const fetchMyAttendance = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get(`/attendances/worker/${user.id}`);
        const rows: AttendanceRecord[] = Array.isArray(res.data) ? res.data : (res.data?.attendances ?? []);
        const mapped: EmployeeAttendance[] = rows.map((r) => ({
          date: new Date(r.scan_time).toISOString().split("T")[0],
          scanTime: new Date(r.scan_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLate: Boolean(r.is_late),
          sessionId: r.session_id,
        }));
        setAttendances(mapped);
        setTodayScanned(mapped.some((a) => a.date === new Date().toISOString().split("T")[0]));
      } catch (err) {
        console.error("Error fetching attendance", err);
        setAttendances([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyAttendance();
  }, [user]);

  const todayAttendance = attendances.find((a) => a.date === new Date().toISOString().split("T")[0]);
  const onTimeCount = attendances.filter((a) => !a.isLate).length;
  const lateCount = attendances.filter((a) => a.isLate).length;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-slate-200 rounded-2xl"></div>
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Attendance</h1>
        <p className="text-slate-600 mt-1">Track your check-in records and punctuality</p>
      </div>

      {/* Today's Status */}
      <div className={`rounded-3xl shadow-lg p-8 border-2 ${
        todayScanned
          ? todayAttendance?.isLate
            ? "bg-amber-50 border-amber-200"
            : "bg-emerald-50 border-emerald-200"
          : "bg-slate-50 border-slate-200"
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Today's Status</h2>
            {todayScanned ? (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  {todayAttendance?.isLate ? (
                    <AlertCircle size={24} className="text-amber-600" />
                  ) : (
                    <CheckCircle size={24} className="text-emerald-600" />
                  )}
                  <div>
                    <p className="font-bold text-slate-900">Check-in Time</p>
                    <p className={`text-sm ${todayAttendance?.isLate ? "text-amber-600" : "text-emerald-600"}`}>
                      {todayAttendance?.scanTime} {todayAttendance?.isLate ? "(Late)" : "(On Time)"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-slate-600">No check-in recorded yet today</p>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <p className="text-sm text-slate-500 font-medium">Total Check-ins</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{attendances.length}</p>
        </div>
        <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">On Time</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{onTimeCount}</p>
            </div>
            <CheckCircle size={24} className="text-emerald-600" />
          </div>
        </div>
        <div className="bg-white border border-amber-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Late</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{lateCount}</p>
            </div>
            <AlertCircle size={24} className="text-amber-600" />
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar size={24} className="text-indigo-600" />
            Attendance History
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {attendances.map((record, idx) => (
            <div
              key={idx}
              className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-slate-900">
                  {new Date(record.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock size={16} className="text-slate-500" />
                  <p className="text-sm text-slate-600">{record.scanTime}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                  record.isLate
                    ? "bg-amber-50 text-amber-600 border border-amber-100"
                    : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                }`}
              >
                {record.isLate ? "Late" : "On Time"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Punctuality Summary */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-sm p-8 border border-indigo-100">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Punctuality Summary</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-700 font-medium">On-Time Rate</span>
            <span className="text-lg font-bold text-emerald-600">
              {attendances.length > 0 ? ((onTimeCount / attendances.length) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all"
              style={{
                width: `${attendances.length > 0 ? ((onTimeCount / attendances.length) * 100) : 0}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
