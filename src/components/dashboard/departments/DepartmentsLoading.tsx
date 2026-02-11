export default function DepartmentsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 animate-pulse"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="h-6 bg-slate-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-slate-100 rounded w-20"></div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-200"></div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="h-3 bg-slate-100 rounded w-24 mb-2"></div>
            <div className="h-10 bg-slate-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
