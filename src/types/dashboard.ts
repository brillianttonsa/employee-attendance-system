import type { ReactNode } from "react";

export interface ActivityItem {
  id: string;
  workerName: string;
  action: string;
  time: string;
  department: string;
}

// dashboard stats
export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  color?: 'indigo' | 'emerald' | 'rose' | 'amber';
}



