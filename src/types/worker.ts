// src/types/worker.ts

export type WorkerStatus = "active" | "inactive" | "retired";

export interface Worker {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  department_id: number | null;
  department_name: string | null;
  position: string | null;
  status: WorkerStatus;
  hire_date: string | null;
  qr_code?: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface WorkerFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department_id: string;
  position: string;
  hire_date: string;
  status?: WorkerStatus;
}

export interface WorkerFilters {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
}