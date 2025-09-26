// User roles
export type Role = 'admin' | 'team' | 'consultant' | 'client'

// Project status
export type ProjectStatus = 'planned' | 'active' | 'paused' | 'completed'

// Task status  
export type TaskStatus = 'redline' | 'progress' | 'completed'

// Task priority
export type Priority = 'low' | 'med' | 'high'

// User interface
export interface User {
  id: number
  name: string
  email: string
  role: Role
  avatar?: string
  created_at: string
  updated_at: string
}

// Project interface
export interface Project {
  id: number
  name: string
  description?: string
  status: ProjectStatus
  start_date?: string
  end_date?: string
  created_by: number
  created_at: string
  updated_at: string
  tasks_count?: number
  members_count?: number
}

// Task interface
export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  project_id: number
  assigned_to?: number
  assigned_user?: User
  created_by: number
  due_date?: string
  created_at: string
  updated_at: string
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

// Auth interfaces
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}