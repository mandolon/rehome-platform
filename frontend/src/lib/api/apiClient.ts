interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}

class ApiClient {
  private baseURL: string
  private apiURL: string

  constructor() {
    // Use mock API base URL when in mock mode, otherwise use the configured API URL
    if (process.env.NEXT_PUBLIC_USE_API_MOCK === '1') {
      // In mock mode, ensure SPA endpoints are under /api/app
      this.apiURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/app'
      this.baseURL = '' // No separate base URL needed for mock mode
    } else {
      // Default real API URL now points to /api/app for SPA area
      this.apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/app'
      // Extract base URL for CSRF endpoint (remove /api/app suffix)
      this.baseURL = this.apiURL.replace('/api/app', '')
    }
  }

  // Helper to get CSRF cookie
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

  // Generic request method
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.apiURL}${endpoint}`
    
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
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