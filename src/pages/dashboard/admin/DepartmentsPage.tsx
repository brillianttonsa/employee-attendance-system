import { Suspense } from "react";
import { Plus } from "lucide-react";
import { useDepartments } from "../../../hooks/useDepartments";
import { DepartmentsList } from "../../../components/dashboard/departments/DepartmentsList";
import DepartmentsLoading from "../../../components/dashboard/departments/DepartmentsLoading";
import { AddDepartmentDialog } from "../../../components/dashboard/departments/AddDepartmentDialog";

export default function DepartmentsPage() {
  const { departments, isLoading, refresh } = useDepartments();

  return (
    <div className="max-w-7xl py-4 mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Departments</h1>
          <p className="text-muted-foreground mt-1">
            View all departments and their employee count
          </p>
        </div>
        <AddDepartmentDialog onComplete={refresh}>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 hover:cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </button>
        </AddDepartmentDialog>
      </div>

      <Suspense fallback={<DepartmentsLoading />}>
        {isLoading ? <DepartmentsLoading /> : <DepartmentsList departments={departments} />}
      </Suspense>
    </div>
  );
}
