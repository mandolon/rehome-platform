const baseURL = 'http://localhost:9000'

interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

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

/**
 * Bootstrap CSRF protection by fetching the CSRF cookie
 */
export async function csrfBootstrap(): Promise<void> {
  const response = await fetch(`${baseURL}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    throw new Error(`CSRF bootstrap failed: ${response.status}`)
  }
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  // Ensure CSRF cookie is set first
  await csrfBootstrap()
  
  const response = await fetch(`${baseURL}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ email, password }),
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    const error: ApiError = data
    throw error
  }
  
  return data
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  const response = await fetch(`${baseURL}/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
  
  if (!response.ok) {
    throw new Error(`Logout failed: ${response.status}`)
  }
}

/**
 * Get the current authenticated user
 */
export async function getUser(): Promise<User> {
  const response = await fetch(`${baseURL}/user`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    const error: ApiError = data
    throw error
  }
  
  return data
}