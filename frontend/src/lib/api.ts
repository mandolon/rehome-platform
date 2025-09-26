const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface Request {
  id: number;
  title: string;
  client: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  budget: string;
  timeline: string;
  location: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  startDate: string;
  endDate: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  bio?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'designer' | 'contractor';
  status: 'active' | 'pending' | 'inactive';
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Requests
  async getRequests(): Promise<Request[]> {
    return this.request<Request[]>('/api/requests');
  }

  async getRequest(id: number): Promise<Request> {
    return this.request<Request>(`/api/requests/${id}`);
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/api/projects');
  }

  // User
  async getMe(): Promise<User> {
    return this.request<User>('/api/me');
  }

  // Team
  async getTeam(): Promise<TeamMember[]> {
    return this.request<TeamMember[]>('/api/team');
  }
}

export const api = new ApiClient();