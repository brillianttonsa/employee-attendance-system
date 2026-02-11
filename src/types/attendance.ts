export interface AttendanceSession {
  id: number;
  qr_code_temp: string;
  qr_code_static: string;
  created_at: string;
  expires_at: string;
  status: 'active' | 'expired';
}

export interface AttendanceRecord {
  id: number;
  worker_id: number;
  worker_name: string;
  session_id: number;
  scan_time: string;
  is_late: boolean;
}

export type { };
