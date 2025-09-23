import apiClient from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'project_manager' | 'team_member' | 'client';
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
}

export class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
      return response.data || response as AuthResponse;
    } catch (error: any) {
      throw {
        message: error.message || 'Login failed',
        errors: error.errors || {},
        status: error.status || 422,
      };
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      return response.data || response as AuthResponse;
    } catch (error: any) {
      throw {
        message: error.message || 'Registration failed',
        errors: error.errors || {},
        status: error.status || 422,
      };
    }
  }

  async me(): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>('/auth/me');
      // Handle both {user: User} and direct User response formats
      return response.data?.user || (response as any).user || (response as any);
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to get user info',
        status: error.status || 401,
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
      // Reset CSRF state after logout
      apiClient.resetCsrf();
    } catch (error: any) {
      // Logout should succeed even if there's an error
      console.warn('Logout warning:', error.message);
      apiClient.resetCsrf();
    }
  }
}

export const authService = new AuthService();
export default authService;