import React from 'react';
import type { StatCardProps } from '../../types/dashboard';
import { colorStyles } from '../constant/statColor';



export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'indigo' 
}) => {
  const styles = colorStyles[color];

  return (
    <div className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      
      {/* Background Decorative Gradient */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${styles.gradient} blur-2xl group-hover:scale-150 transition-transform duration-500`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl border shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${styles.icon}`}>
            {React.cloneElement(icon as React.ReactElement)}
          </div>
          
          {/* Decorative Dot */}
          <div className={`h-2 w-2 rounded-full animate-pulse ${styles.dot}`} />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              {value}
            </h3>
          </div>
          
        </div>
      </div>

      {/* Subtle Bottom Accent Bar */}
      <div className={`absolute bottom-0 left-0 h-1 w-full transition-all duration-500 ${styles.dot}`} />
    </div>
  );
};