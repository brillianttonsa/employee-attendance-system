import { Suspense } from "react";
import { useReports } from "../../../hooks/useReports";
import { ReportsList } from "../../../components/dashboard/reports/ReportsList";

function ReportsLoading() {
  return (
    <div className="max-w-7xl py-4 mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-slate-200 rounded-2xl p-6 h-32"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-200 rounded-2xl p-8 h-64"></div>
        <div className="bg-slate-200 rounded-2xl p-8 h-64"></div>
      </div>
      <div className="bg-slate-200 rounded-2xl p-8 h-48"></div>
      <div className="bg-slate-200 rounded-2xl p-8 h-64"></div>
    </div>
  );
}

export default function ReportsPage() {
  const { stats, isLoading } = useReports();

  return (
    <div className="max-w-7xl py-4 mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground mt-1">
          Analytics and insights about your workforce
        </p>
      </div>

      <Suspense fallback={<ReportsLoading />}>
        {isLoading ? <ReportsLoading /> : <ReportsList stats={stats} />}
      </Suspense>
    </div>
  );
}
