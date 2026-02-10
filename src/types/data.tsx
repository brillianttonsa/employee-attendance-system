import { Clock, UserCheck, UserX, Users } from "lucide-react";
import type { ActivityItem } from "./dashboard";

export const MOCK_STATS = [
  { title: "Total Workers", value: "1,240", trend: 12, color: "indigo" as const, icon: <Users /> },
  { title: "Present Today", value: "1,102", trend: 2, color: "emerald" as const, icon: <UserCheck /> },
  { title: "Late Arrivals", value: "64", trend: -5, color: "amber" as const, icon: <Clock /> },
  { title: "Absent", value: "74", trend: 8, color: "rose" as const, icon: <UserX /> }
];

export const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: '1', workerName: 'Sarah Jenkins', action: 'Clocked in at Main Entrance', time: '2 mins ago',  department: 'Engineering' },
  { id: '2', workerName: 'Michael Chen', action: 'Clocked in at Warehouse B', time: '12 mins ago',  department: 'Logistics' },
  { id: '3', workerName: 'Amara Okafor', action: 'Clocked in at Main Entrance', time: '25 mins ago',  department: 'Design' },
  { id: '4', workerName: 'David Miller', action: 'Marked Absent (No-show)', time: '1 hour ago',  department: 'Sales' },
  { id: '5', workerName: 'James Wilson', action: 'Clocked in at Office Lobby', time: '1 hour ago',  department: 'Marketing' }
];

export const MOCK_CHART_DATA = [
  { name: 'Mon', total: 850, late: 45 },
  { name: 'Tue', total: 920, late: 32 },
  { name: 'Wed', total: 880, late: 58 },
  { name: 'Thu', total: 940, late: 28 },
  { name: 'Fri', total: 910, late: 38 },
  { name: 'Sat', total: 420, late: 12 },
  { name: 'Sun', total: 380, late: 10 },
];