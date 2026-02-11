import { useState } from "react";
import { MoreHorizontal, Search, Pencil, Trash2 } from "lucide-react";
import { EditWorkerDialog } from "./EditWorkerDialog";
// Import your types
import type { Worker, Department, WorkerFilters } from "../../../types/worker";

interface WorkersListProps {
  workers: Worker[];
  allWorkers: Worker[]; // full filtered list for export
  departments: Department[];
  onDelete: (id: number) => Promise<void> | void;
  onEditSuccess: () => void;
  totalCount: number;
  filters: WorkerFilters; // Use the new interface here
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
}

export function WorkersList({ workers, allWorkers, departments, filters, onDelete, onEditSuccess, totalCount, page, setPage, pageSize }: WorkersListProps) {
  // Use the Worker type for the state
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const exportCsv = () => {
    const cols = [
      "id",
      "employee_id",
      "first_name",
      "last_name",
      "email",
      "phone",
      "department_name",
      "position",
      "status",
      "hire_date",
    ];

    const rows = allWorkers.map((w) => cols.map((c) => (w as any)[c] ?? ""));
    const csv = [cols.join(","), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workers_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* ... Filters Section (Same as your code) ... */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search workers..."
            value={filters.search}
            onChange={(e) => filters.setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <select 
          value={filters.statusFilter} 
          onChange={(e) => filters.setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="retired">Retired</option>
        </select>

        <select 
          value={filters.departmentFilter} 
          onChange={(e) => filters.setDepartmentFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id.toString()}>{dept.name}</option>
          ))}
        </select>
        <div className="flex items-center">
          <button
            onClick={exportCsv}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-48">Employee</th>
                <th className="hidden md:table-cell px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Department</th>
                <th className="hidden lg:table-cell px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Position</th>
                <th className="hidden md:table-cell px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Status</th>
                <th className="px-6 py-4 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workers.map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 w-48">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm uppercase flex-shrink-0">
                        {worker.first_name[0]}{worker.last_name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{worker.first_name} {worker.last_name}</p>
                        <p className="text-xs text-slate-500 font-medium truncate">{worker.employee_id}</p>
                        {/* Mobile: Show department and status below on small screens */}
                        <div className="flex flex-wrap gap-2 mt-2 md:hidden">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                            {worker.department_name || "Unassigned"}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            worker.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
                            worker.status === 'inactive' ? 'bg-amber-50 text-amber-600' : 
                            'bg-slate-50 text-slate-600'
                          }`}>
                            {worker.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 w-32">
                    <span className="text-sm font-medium text-slate-600 truncate block">
                      {worker.department_name || "Unassigned"}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 w-32">
                    <span className="text-sm font-medium text-slate-600 truncate block">
                      {worker.position || "—"}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 w-24">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      worker.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      worker.status === 'inactive' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                      'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {worker.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 w-16 relative">
                    <button 
                      onClick={() => setMenuOpenId(menuOpenId === worker.id ? null : worker.id)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {menuOpenId === worker.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                        <div className="absolute right-6 top-12 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          <button 
                            onClick={() => { setEditingWorker(worker); setMenuOpenId(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left font-medium"
                          >
                            <Pencil size={14} /> Edit Worker
                          </button>
                          <button 
                            onClick={() => { onDelete(worker.id); setMenuOpenId(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left font-medium"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Showing {workers.length} of {totalCount} Workers
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 mt-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-sm"
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-sm text-slate-500">Page {page} of {Math.max(1, Math.ceil(totalCount / pageSize))}</span>
        <button
          onClick={() => setPage(Math.min(Math.ceil(totalCount / pageSize), page + 1))}
          className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-sm"
          disabled={page >= Math.ceil(totalCount / pageSize)}
        >
          Next
        </button>
      </div>

      {/* Syncing the Edit Modal props with the standard pattern we built */}
      {editingWorker && (
        <EditWorkerDialog
          worker={editingWorker}
          departments={departments}
          open={!!editingWorker}
          onOpenChange={(isOpen: boolean) => !isOpen && setEditingWorker(null)}
          onSuccess={() => {
            onEditSuccess();
            setEditingWorker(null);
          }}
        />
      )}
    </div>
  );
}