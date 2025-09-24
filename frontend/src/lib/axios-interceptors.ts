import axiosInstance from './api'
import { useRouter } from 'next/navigation'

/**
 * Global axios interceptors for authentication and error handling
 * Call this once in your app initialization (e.g., _app.tsx or layout.tsx)
 */
export function setupAxiosInterceptors() {
  // Request interceptor - ensure fresh CSRF token for state-changing requests
  axiosInstance.interceptors.request.use(
    async (config) => {
      // For state-changing requests, ensure we have a fresh CSRF token
      const stateMutatingMethods = ['post', 'put', 'patch', 'delete']
      if (stateMutatingMethods.includes(config.method?.toLowerCase() || '')) {
        try {
          // Only refresh CSRF if we don't already have the header
          if (!config.headers['X-XSRF-TOKEN']) {
            await axiosInstance.get('/sanctum/csrf-cookie', {
              baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:9000'
            })
          }
        } catch (error) {
          console.warn('Failed to refresh CSRF token:', error)
        }
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor - handle auth errors and validation
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { response } = error

      if (response?.status === 401) {
        // Unauthorized - clear auth state and redirect to login
        console.warn('Authentication expired, redirecting to login')
        
        // Clear any client-side auth state
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user')
          sessionStorage.removeItem('user')
          
          // Redirect to login page
          window.location.href = '/login'
        }
        
        return Promise.reject(new Error('Authentication required'))
      }

      if (response?.status === 403) {
        // Forbidden - user doesn't have permission
        console.warn('Access forbidden:', response.data?.message)
        return Promise.reject(new Error(response.data?.message || 'Access forbidden'))
      }

      if (response?.status === 419) {
        // CSRF token mismatch - refresh and retry once
        console.warn('CSRF token expired, refreshing...')
        
        try {
          await axiosInstance.get('/sanctum/csrf-cookie', {
            baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:9000'
          })
          
          // Retry the original request once
          return axiosInstance.request(error.config)
        } catch (retryError) {
          console.error('Failed to refresh CSRF token:', retryError)
          return Promise.reject(error)
        }
      }

      if (response?.status === 422) {
        // Validation errors - format for easy display
        const validationErrors = response.data?.errors || {}
        const formattedError = new Error('Validation failed')
        ;(formattedError as any).validationErrors = validationErrors
        ;(formattedError as any).message = response.data?.message || 'Validation failed'
        
        return Promise.reject(formattedError)
      }

      if (response?.status >= 500) {
        // Server errors
        console.error('Server error:', response.status, response.data)
        return Promise.reject(new Error('Server error occurred. Please try again.'))
      }

      // Network or other errors
      if (!response) {
        console.error('Network error:', error.message)
        return Promise.reject(new Error('Network error. Please check your connection.'))
      }

      return Promise.reject(error)
    }
  )
}

/**
 * Helper to check if error is a validation error
 */
export function isValidationError(error: any): error is Error & { validationErrors: Record<string, string[]> } {
  return error?.validationErrors && typeof error.validationErrors === 'object'
}

/**
 * Helper to extract first validation error message for a field
 */
export function getValidationError(error: any, field: string): string | null {
  if (!isValidationError(error)) return null
  const fieldErrors = error.validationErrors[field]
  return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : null
}
