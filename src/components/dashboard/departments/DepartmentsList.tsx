import { Users } from "lucide-react";
import type { DepartmentWithCount } from "../../../hooks/useDepartments";

interface DepartmentsListProps {
  departments: DepartmentWithCount[];
}

export function DepartmentsList({ departments }: DepartmentsListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((dept) => (
        <div
          key={dept.id}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{dept.name}</h3>
              <p className="text-xs text-slate-500 mt-1">Department</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Users size={24} />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-indigo-600">{dept.workerCount}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
