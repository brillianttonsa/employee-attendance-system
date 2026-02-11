import { Link, useLocation } from "react-router-dom"
import { 
  LayoutDashboard,
  Users,
  QrCode,
  BarChart3,
  Settings,
  LogOut,
  Clock,
  CalendarDays,
  Menu,
  X,
  Layers,
  User as UserIcon,
  ChevronDown
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import api from "../../service/api"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Workers", href: "/dashboard/workers", icon: Users },
  { name: "Departments", href: "/dashboard/departments", icon: Layers },
  { name: "Attendance", href: "/dashboard/attendance", icon: CalendarDays },
  { name: "QR Sessions", href: "/dashboard/qr-codes", icon: QrCode },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false) // State for the user dropdown
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">AttendTrack</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Management</p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/dashboard" && location.pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Profile/Logout Section */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        {/* User Info Display */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-800">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-600/30">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Admin User</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* --- MOBILE TOP BAR (< md) --- */}
      <header className="md:hidden flex items-center justify-between px-4 h-16 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-white font-bold tracking-tight">AttendTrack</span>
        </div>

        {/* Mobile User Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-1 p-1 rounded-full bg-slate-800 border border-slate-700"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <UserIcon className="w-4 h-4" />
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logged in as</p>
                <p className="text-sm font-medium text-slate-900 truncate">{user?.email || 'Admin User'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* --- OVERLAY --- */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* --- SIDEBAR (Mobile Drawer & Desktop Fixed) --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-64 transform transition-transform duration-300 ease-in-out 
          md:relative md:translate-x-0 shrink-0 h-full ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button for mobile inside the sidebar */}
        <div className="md:hidden absolute right-4 top-4">
           <button onClick={() => setMobileOpen(false)} className="text-slate-500 hover:text-white">
             <X className="w-6 h-6" />
           </button>
        </div>
        <SidebarContent />
      </aside>
    </>
  )
}