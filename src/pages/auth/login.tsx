import React, { useState } from "react"
import { useNavigate } from "react-router-dom" // or window.location if not using React Router
import { useAuth } from "../../context/AuthContext"
import { Loader2, AlertCircle, Clock } from "lucide-react"

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate() // for redirect
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)

      // Redirect based on role from auth context (set during login)
      const userRole = user?.role;
      if (userRole === "admin") navigate("/dashboard");
      else navigate("/employee");
    } catch (err: any) {
      setError(err?.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AttendTrack</h1>
            <p className="text-sm text-gray-500">Employee Attendance System</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="p-6">
            <h2 className="text-2xl text-center font-semibold mb-2">Sign In</h2>
            <p className="text-center text-gray-500 mb-6">
              Enter your credentials to access the system
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              Demo credentials: admin@example.com / password
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Need help? Contact your system administrator
        </p>
      </div>
    </div>
  )
}