import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import type { AttendanceRecord } from "../../../types/attendance";

interface AttendancesListProps {
  attendances: AttendanceRecord[];
  sessionId?: number;
}

export function AttendancesList({ attendances, sessionId }: AttendancesListProps) {
  const filtered = sessionId
    ? attendances.filter((a) => a.session_id === sessionId)
    : attendances;

  const onTimeCount = filtered.filter((a) => !a.is_late).length;
  const lateCount = filtered.filter((a) => a.is_late).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <p className="text-sm text-slate-500 font-medium">Total Scans</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{filtered.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">On Time</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{onTimeCount}</p>
            </div>
            <CheckCircle size={24} className="text-emerald-600" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Late</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{lateCount}</p>
            </div>
            <AlertCircle size={24} className="text-amber-600" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Scan Time</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{record.worker_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock size={16} />
                        {new Date(record.scan_time).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          record.is_late
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}
                      >
                        {record.is_late ? "Late" : "On Time"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    No attendance records yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
