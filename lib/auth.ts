import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { query, queryOne } from './db'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export interface User {
  id: number
  email: string
  role: 'admin' | 'worker'
}

export interface SessionPayload {
  userId: number
  email: string
  role: 'admin' | 'worker'
  expiresAt: Date
}

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Verify password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Create JWT token
export async function createToken(payload: Omit<SessionPayload, 'expiresAt'>): Promise<string> {
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
  
  return new SignJWT({ ...payload, expiresAt: expiresAt.toISOString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2d')
    .sign(JWT_SECRET)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

// Get current session from cookies
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  
  if (!token) return null
  
  return verifyToken(token)
}

// Set session cookie
export async function setSession(payload: Omit<SessionPayload, 'expiresAt'>): Promise<void> {
  const token = await createToken(payload)
  const cookieStore = await cookies()
  
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 2 * 24 * 60 * 60, // 2 days
    path: '/',
  })
}

// Clear session cookie
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await queryOne<{ id: number; email: string; password_hash: string; role: 'admin' | 'worker' }>(
    'SELECT id, email, password_hash, role FROM users WHERE email = $1',
    [email]
  )
  
  if (!user) return null
  
  const isValid = await verifyPassword(password, user.password_hash)
  if (!isValid) return null
  
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  }
}

// Create new user
export async function createUser(email: string, password: string, role: 'admin' | 'worker'): Promise<User | null> {
  const passwordHash = await hashPassword(password)
  
  const result = await queryOne<{ id: number; email: string; role: 'admin' | 'worker' }>(
    'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
    [email, passwordHash, role]
  )
  
  return result
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  return queryOne<User>(
    'SELECT id, email, role FROM users WHERE id = $1',
    [id]
  )
}

// Worker-specific: Get worker profile by user ID
export async function getWorkerByUserId(userId: number) {
  return queryOne(
    `SELECT w.*, d.name as department_name 
     FROM workers w 
     LEFT JOIN departments d ON w.department_id = d.id 
     WHERE w.user_id = $1`,
    [userId]
  )
}
