import axiosInstance, { initCsrf } from './api'

interface User {
  id: number
  name: string
  email: string
  role: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

interface LoginResponse {
  user: User
  token?: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

/**
 * Register a new user
 */
export async function register(payload: RegisterPayload): Promise<LoginResponse> {
  await initCsrf()
  const response = await axiosInstance.post('/auth/register', payload)
  return response.data
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  await initCsrf()
  const response = await axiosInstance.post('/auth/login', { email, password })
  return response.data
}

/**
 * Get the current authenticated user
 */
export async function me(): Promise<User> {
  await initCsrf()
  const response = await axiosInstance.get('/auth/me')
  return response.data
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  await initCsrf()
  await axiosInstance.post('/auth/logout')
}
