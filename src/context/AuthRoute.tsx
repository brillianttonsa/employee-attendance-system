import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import type { AuthRouteProps } from "../types/User"
import { Loading } from "../components/Loading"


export const AuthRoute = ({ children, role }: AuthRouteProps) => {
  const { user, loading } = useAuth()

  // Show a loading spinner while auth state is loading
  if (loading) return <Loading />

  // If not logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />

  // If role is provided and user role doesn't match
  if (role && user.role !== role) {
    // redirect to their dashboard 
    return <Navigate to={user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard"} replace />
  }

  return children
}