import type { ActivityItem } from "../../types/dashboard";
import { CYCLE_COLORS } from "../constant/recentColor";

export const RecentActivity: React.FC<{ activities: ActivityItem[] }> = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Recent Activity</h3>
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
      
<div className="p-5 space-y-6">
  {activities.map((item, index) => {
    
    const activeColor = CYCLE_COLORS[index % CYCLE_COLORS.length];

    return (
      <div key={item.id} className="relative flex gap-4">
        {/* Timeline connector line */}
        {index !== activities.length - 1 && (
          <span className="absolute left-[15px] top-8 w-[2px] h-10 bg-slate-100" />
        )}
        
        {/* The Dot with interchanging colors */}
        <div className={`z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${activeColor}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className="text-sm font-bold text-slate-900 truncate">{item.workerName}</p>
            <span className="text-[10px] font-medium text-slate-400 uppercase">{item.time}</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 italic">
            {item.action}
          </p>
        </div>
      </div>
    );
  })}
</div>
      {/* To be a btn link in the future */}
      <button className="w-full py-3 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors border-t border-slate-100">
        View Full Logs
      </button>
    </div>
  );
};