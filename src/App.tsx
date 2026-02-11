import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// context
import { AuthProvider } from "./context/AuthContext"
import { AuthRoute } from "./context/AuthRoute" 

// pages
import LoginPage from "./pages/auth/login"

// dahboard layout
import DashboardLayout from "./components/dashboard/DashboardLayout"


// dashboard pages
import Employee from "./pages/dashboard/Employee"
import Dashboard from "./pages/dashboard/Dashboard"
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard"
import WorkersPage from "./pages/dashboard/admin/WorkersPage"
import DepartmentsPage from "./pages/dashboard/admin/DepartmentsPage"
import AttendancePage from "./pages/dashboard/admin/AttendancePage"
import SessionsPage from "./pages/dashboard/admin/SessionsPage"
import ReportsPage from "./pages/dashboard/admin/ReportsPage"
import SettingsPage from "./pages/dashboard/admin/SettingsPage"

import Test from "./pages/Test"
// import Test2 from "./pages/Test2"

function App() {

  return (
      <AuthProvider>
         <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              {/* <Route path="/" element={<Test />}/> */}
              <Route path="/" element={<DashboardLayout/>}>
                <Route index element={<Test/>}/>
              </Route>


              {/* dashboard pages with dashboard layout for admin  */}

              <Route
                path="dashboard"
                element={
                  <AuthRoute role="admin">
                    <DashboardLayout />
                  </AuthRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="workers" element={<WorkersPage />} />
                <Route path="departments" element={<DepartmentsPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="qr-codes" element={<SessionsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              

              <Route path="employee" element={<Employee/>}/>
            </Routes>
          </Router>
      </AuthProvider>
  )
}

export default App