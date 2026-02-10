import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Handles its own mobile drawer vs desktop visibility */}
      <DashboardSidebar />

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* On mobile, this main area scrolls. On desktop, it does too. */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden outline-none">
          <div className="max-w-[1600px] mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}