import { Plus } from "lucide-react";
import { Suspense } from "react";
import WorkersLoading from "../../../components/dashboard/workers/WorkersLoading";
import { WorkersList } from "../../../components/dashboard/workers/WorkersList";
import { AddWorkerDialog } from "../../../components/dashboard/workers/AddWorkerDialog";
import { useWorkers } from "../../../hooks/useWorkers";

export default function WorkersPage() {
  const {
    workers, allFiltered, departments, search, setSearch,
    statusFilter, setStatusFilter, departmentFilter, setDepartmentFilter,
    deleteWorker, refresh, page, setPage, pageSize, totalCount
  } = useWorkers();

  return (
    <div className="max-w-7xl py-4 mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your employees and their information
          </p>
        </div>
        <AddWorkerDialog departments={departments} onComplete={refresh}>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 hover:cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Add Worker
          </button>
        </AddWorkerDialog>
      </div>

      <Suspense fallback={<WorkersLoading />}>
        <WorkersList
          workers={workers}
          allWorkers={allFiltered}
          departments={departments}
          filters={{ search, setSearch, statusFilter, setStatusFilter, departmentFilter, setDepartmentFilter }}
          onDelete={deleteWorker}
          onEditSuccess={refresh}
          totalCount={totalCount}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  )
}