/**
 * CSRF-Aware API Client for Next.js Frontend
 * 
 * This module provides reusable API helpers for CSRF-protected authentication
 * that integrates with Laravel Sanctum backend configuration.
 */

interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}

interface ApiResponse<T> {
  data: T
  message?: string
}

interface LoginCredentials {
  email: string
  password: string
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

class ApiClient {
  private baseURL: string
  private apiURL: string

  constructor() {
    // Use mock API base URL when in mock mode, otherwise use the configured API URL
    if (process.env.NEXT_PUBLIC_USE_API_MOCK === '1') {
      this.apiURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
      this.baseURL = '' // No separate base URL needed for mock mode
    } else {
      this.apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api'
      // Extract base URL for CSRF endpoint (remove /api suffix)
      this.baseURL = this.apiURL.replace('/api', '')
    }
  }

  /**
   * Initialize CSRF protection by fetching the CSRF cookie
   * This must be called before any state-changing operations (POST, PUT, DELETE)
   */
  async csrf(): Promise<void> {
    try {
      const csrfUrl = process.env.NEXT_PUBLIC_USE_API_MOCK === '1' 
        ? '/sanctum/csrf-cookie'  // Mock endpoint
        : `${this.baseURL}/sanctum/csrf-cookie`  // Real Laravel endpoint
        
      await fetch(csrfUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      })
    } catch (error) {
      console.error('CSRF cookie request failed:', error)
      throw {
        message: 'Failed to initialize CSRF protection',
        status: 500,
      } as ApiError
    }
  }

  /**
   * Extract XSRF token from cookies and return it as a header value
   * This is used to include the CSRF token in requests
   */
  xsrfHeaderFromCookie(): string | null {
    if (typeof document === 'undefined') {
      return null // Server-side rendering
    }

    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'XSRF-TOKEN') {
        // URL decode the token as Laravel expects it decoded
        return decodeURIComponent(value)
      }
    }
    return null
  }

  /**
   * Generic request method with CSRF token handling
   */
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.apiURL}${endpoint}`
    
    // Get XSRF token from cookie for state-changing requests
    const xsrfToken = this.xsrfHeaderFromCookie()
    
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Include XSRF token for state-changing requests
        ...(xsrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET') && {
          'X-XSRF-TOKEN': xsrfToken
        }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      // Handle different response types
      let data: any
      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        throw {
          message: data?.message || `HTTP Error ${response.status}`,
          status: response.status,
          errors: data?.errors || undefined,
        } as ApiError
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 500,
        } as ApiError
      }
      throw error
    }
  }

  // HTTP method helpers
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

/**
 * Login user with email and password
 * Automatically handles CSRF token initialization
 */
export async function login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
  // Get CSRF cookie first
  await apiClient.csrf()
  return apiClient.post<ApiResponse<User>>('/auth/login', credentials)
}

/**
 * Logout the current user
 * Uses the correct /logout endpoint with proper CSRF handling
 */
export async function logout(): Promise<{ message: string } | any> {
  // Ensure CSRF cookie exists
  if (typeof apiClient?.csrf === "function") {
    await apiClient.csrf();
  } else {
    await fetch("http://localhost:9000/sanctum/csrf-cookie", {
      method: "GET",
      credentials: "include",
      headers: { "Accept": "application/json", "X-Requested-With": "XMLHttpRequest" },
    });
  }

  const xsrf =
    typeof apiClient?.xsrfHeaderFromCookie === "function"
      ? apiClient.xsrfHeaderFromCookie()
      : (document.cookie.split("; ").find(c => c.startsWith("XSRF-TOKEN="))?.split("=")[1] ?? "");

  const res = await fetch("http://localhost:9000/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(xsrf && { "X-XSRF-TOKEN": xsrf }),
    },
    body: "{}",
  });

  if (!res.ok) throw new Error(`Logout failed (${res.status})`);
  return res.status === 204 ? { message: "Logged out" } : res.json();
}

/**
 * Get current authenticated user
 */
export async function me(): Promise<ApiResponse<User>> {
  return apiClient.get<ApiResponse<User>>('/auth/me')
}

/**
 * Register a new user
 * Automatically handles CSRF token initialization
 */
export async function register(data: {
  name: string
  email: string
  password: string
  password_confirmation: string
}): Promise<ApiResponse<User>> {
  // Get CSRF cookie first
  await apiClient.csrf()
  return apiClient.post<ApiResponse<User>>('/auth/register', data)
}

// Export types for use in other modules
export type { ApiError, ApiResponse, LoginCredentials, User }