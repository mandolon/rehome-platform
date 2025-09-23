import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      Cookies.remove('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const apiClient = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    api.get(url, config),
  
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    api.post(url, data, config),
  
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    api.put(url, data, config),
  
  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    api.patch(url, data, config),
  
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    api.delete(url, config),
};

export default api;