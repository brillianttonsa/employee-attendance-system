
export type User = {
  id: string
  email: string
  role: "admin" | "employee"
}

export type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export type Children = {
  children: React.ReactNode
}

export type AuthRouteProps = {
  children: React.ReactNode
  role: "admin" | "employee" 
}
