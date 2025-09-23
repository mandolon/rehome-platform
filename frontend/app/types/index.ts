export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'project_manager' | 'architect' | 'contractor' | 'client';
  phone?: string;
  company?: string;
  title?: string;
  avatar?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  owner_id: number;
  client_name?: string;
  project_type: 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'renovation';
  location?: string;
  created_at: string;
  updated_at: string;
  owner?: User;
  users?: ProjectUser[];
  tasks?: Task[];
  files?: ProjectFile[];
}

export interface ProjectUser {
  id: number;
  project_id: number;
  user_id: number;
  role: 'project_manager' | 'architect' | 'contractor' | 'client' | 'viewer';
  joined_at: string;
  user?: User;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  completion_percentage: number;
  project_id: number;
  assigned_to?: number;
  created_by: number;
  parent_task_id?: number;
  created_at: string;
  updated_at: string;
  project?: Project;
  assignedUser?: User;
  creator?: User;
  parentTask?: Task;
  subtasks?: Task[];
  comments?: TaskComment[];
  files?: TaskFile[];
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  comment: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface ProjectFile {
  id: number;
  project_id: number;
  name: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: number;
  category: 'blueprint' | 'design' | 'permit' | 'photo' | 'document' | 'other';
  description?: string;
  created_at: string;
  updated_at: string;
  uploader?: User;
}

export interface TaskFile {
  id: number;
  task_id: number;
  name: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: number;
  description?: string;
  created_at: string;
  updated_at: string;
  uploader?: User;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_tasks: number;
  completed_tasks: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
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
  role: User['role'];
  company?: string;
  title?: string;
  phone?: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  client_name?: string;
  project_type: Project['project_type'];
  location?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: Task['priority'];
  due_date?: string;
  estimated_hours?: number;
  assigned_to?: number;
  parent_task_id?: number;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  completion_percentage?: number;
  assigned_to?: number;
}