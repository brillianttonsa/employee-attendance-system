import { BarChart3, Users, CheckCircle, AlertCircle, Archive, Clock, Briefcase } from "lucide-react";

interface ReportsListProps {
  stats: {
    totalWorkers: number;
    activeWorkers: number;
    inactiveWorkers: number;
    retiredWorkers: number;
    byDepartment: { name: string; count: number }[];
    byStatus: { label: string; count: number; color: string }[];
    topPositions?: { position: string; count: number }[];
    recentHires?: { name: string; position: string; department: string; hireDate: string }[];
  };
}

export function ReportsList({ stats }: ReportsListProps) {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Workers */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Workers</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalWorkers}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        {/* Active Workers */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Active</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.activeWorkers}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            {stats.totalWorkers > 0 ? ((stats.activeWorkers / stats.totalWorkers) * 100).toFixed(1) : 0}% of total
          </p>
        </div>

        {/* Inactive Workers */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Inactive</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{stats.inactiveWorkers}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            {stats.totalWorkers > 0 ? ((stats.inactiveWorkers / stats.totalWorkers) * 100).toFixed(1) : 0}% of total
          </p>
        </div>

        {/* Retired Workers */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Retired</p>
              <p className="text-3xl font-bold text-slate-600 mt-2">{stats.retiredWorkers}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
              <Archive size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            {stats.totalWorkers > 0 ? ((stats.retiredWorkers / stats.totalWorkers) * 100).toFixed(1) : 0}% of total
          </p>
        </div>
      </div>

      {/* By Department and By Status - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* By Department */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 size={24} className="text-indigo-600" />
            Workers by Department
          </h2>

          <div className="space-y-4">
            {stats.byDepartment.map((dept, idx) => {
              const maxCount = Math.max(...stats.byDepartment.map((d) => d.count), 1);
              const percentage = (dept.count / maxCount) * 100;

              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-700">{dept.name}</span>
                    <span className="text-sm font-bold text-slate-600">{dept.count} employees</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Status */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Workers by Status</h2>

          <div className="space-y-4">
            {stats.byStatus.map((status, idx) => {
              const colorMap: Record<string, string> = {
                emerald: "bg-emerald-100 text-emerald-700",
                amber: "bg-amber-100 text-amber-700",
                slate: "bg-slate-100 text-slate-700",
              };

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <span className="font-medium text-slate-700">{status.label}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${colorMap[status.color]}`}>
                    {status.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Positions */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Briefcase size={24} className="text-indigo-600" />
          Most Common Positions
        </h2>

        <div className="space-y-3">
          {stats.topPositions && stats.topPositions.length > 0 ? (
            stats.topPositions.map((pos, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow"
              >
                <span className="font-medium text-slate-700">{pos.position || "Unspecified"}</span>
                <span className="text-sm font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                  {pos.count} employees
                </span>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm text-center py-4">No position data available</p>
          )}
        </div>
      </div>

      {/* Recent Hires */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Clock size={24} className="text-emerald-600" />
          Recent Hires
        </h2>

        <div className="space-y-3">
          {stats.recentHires && stats.recentHires.length > 0 ? (
            stats.recentHires.slice(0, 5).map((hire, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div>
                  <p className="font-medium text-slate-900">{hire.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{hire.position} • {hire.department}</p>
                </div>
                <span className="text-xs font-medium text-slate-500">{hire.hireDate}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm text-center py-4">No recent hire data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

