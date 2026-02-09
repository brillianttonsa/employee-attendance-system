import LoginPage from "./pages/auth/login"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"

function App() {

  return (
      <AuthProvider>
         <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Router>
      </AuthProvider>
  )
}

export default App