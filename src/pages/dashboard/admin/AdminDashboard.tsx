import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { RecentActivity } from "../../../components/ui/RecentActicity";
import { StatCard } from "../../../components/ui/StatCard";
import { useReports } from '../../../hooks/useReports';
import { useAttendanceSessions } from '../../../hooks/useAttendanceSessions';
import { QrCode } from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { stats } = useReports();

  return (
    <div className="max-w-7xl py-4 mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Attendance Overview</h1>
          <p className="text-slate-500 font-medium mt-2 text-xl">
            Welcome back, <span className="text-indigo-600">{user?.name || 'Admin'}</span>. Here is what's happening today.
          </p>
          <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button className="mt-6 md:mt-0 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-200 font-bold text-sm">
          <QrCode className="w-4 h-4" />
          Generate New QR
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Workers" value={String(stats.totalWorkers)} color="indigo" />
        <StatCard title="Present Today" value={String(stats.activeWorkers)} color="emerald" />
        <StatCard title="Late Arrivals" value={String(stats.retiredWorkers)} color="amber" />
        <StatCard title="Absent" value={String(stats.inactiveWorkers)} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area: Chart */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Attendance Trends</h3>
                <p className="text-sm text-slate-500 font-medium">Weekly check-in volume</p>
              </div>
              <select className="bg-slate-50 border-none text-xs font-bold text-slate-600 rounded-lg px-3 py-2 ring-1 ring-slate-200 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            
            {/* Real Chart Implementation */}
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[] /* TODO: replace with real chart data from reports or sessions */}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <RecentActivity activities={[] /* TODO: feed recent activity from attendances */} />
        </div>
      </div>
    </div>
  );
}