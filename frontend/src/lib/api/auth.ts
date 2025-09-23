import { apiClient } from './apiClient'
import { User, LoginCredentials, RegisterData, ApiResponse } from '@/lib/types'

export const authApi = {
  // Login user
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    // Get CSRF cookie first
    await apiClient.csrf()
    return apiClient.post<ApiResponse<User>>('/auth/login', credentials)
  },

  // Register user
  async register(data: RegisterData): Promise<ApiResponse<User>> {
    // Get CSRF cookie first
    await apiClient.csrf()
    return apiClient.post<ApiResponse<User>>('/auth/register', data)
  },

  // Get current user
  async me(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>('/auth/me')
  },

  // Logout user
  async logout(): Promise<ApiResponse<null>> {
    return apiClient.post<ApiResponse<null>>('/auth/logout')
  },
}