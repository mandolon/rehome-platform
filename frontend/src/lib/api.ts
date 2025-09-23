// API client with CSRF protection for Laravel Sanctum
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:9000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api';
const WITH_CREDENTIALS = process.env.NEXT_PUBLIC_API_WITH_CREDENTIALS === 'true';

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseURL: string;
  private csrfInitialized = false;

  constructor() {
    this.baseURL = `${API_BASE}${API_PREFIX}`;
  }

  private async initCsrf(): Promise<void> {
    if (this.csrfInitialized) return;

    try {
      const response = await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: WITH_CREDENTIALS ? 'include' : 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.ok) {
        throw new Error(`CSRF fetch failed: ${response.status}`);
      }

      this.csrfInitialized = true;
    } catch (error) {
      console.error('CSRF initialization failed:', error);
      throw new Error('Failed to initialize CSRF protection');
    }
  }

  async request<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Always initialize CSRF before any request
    await this.initCsrf();

    const url = endpoint.startsWith('/') ? `${this.baseURL}${endpoint}` : `${API_BASE}/${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: WITH_CREDENTIALS ? 'include' : 'same-origin',
    };

    try {
      const response = await fetch(url, config);
      
      let data: any = null;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        throw {
          status: response.status,
          message: data?.message || `HTTP ${response.status}`,
          errors: data?.errors || {},
        };
      }

      return data || { message: 'Success' };
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'status' in error) {
        throw error; // Re-throw API errors
      }
      
      console.error('API request failed:', error);
      throw {
        status: 0,
        message: 'Network error or server unavailable',
        errors: {},
      };
    }
  }

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Reset CSRF state (useful for testing)
  resetCsrf(): void {
    this.csrfInitialized = false;
  }
}

export const apiClient = new ApiClient();
export default apiClient;