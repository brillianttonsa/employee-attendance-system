import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// context
import { AuthProvider } from "./context/AuthContext"
import { AuthRoute } from "./context/AuthRoute" 

// pages
import LoginPage from "./pages/auth/login"
// dashboard pages
import Employee from "./pages/dashboard/Employee"
import Dashboard from "./pages/dashboard/Dashboard"
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard"

function App() {

  return (
      <AuthProvider>
         <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route path="dashboard" element={
                <AuthRoute role="admin">
                  <AdminDashboard />
                </AuthRoute>
              }/>

              <Route path="employee" element={<Employee/>}/>
            </Routes>
          </Router>
      </AuthProvider>
  )
}

export default App