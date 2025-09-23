import { apiClient } from './apiClient'
import { Task, ApiResponse, PaginatedResponse, TaskStatus, Priority } from '@/lib/types'

interface ListTasksFilters {
  status?: TaskStatus
  assigned_to?: number
  priority?: Priority
  page?: number
  per_page?: number
}

interface CreateTaskData {
  title: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  project_id: number
  assigned_to?: number
  due_date?: string
}

interface UpdateTaskData extends Partial<CreateTaskData> {
  id: number
}

export const tasksApi = {
  // List tasks by project with filters
  async listTasksByProject(
    projectId: number, 
    filters: ListTasksFilters = {}
  ): Promise<PaginatedResponse<Task>> {
    const searchParams = new URLSearchParams()
    
    if (filters.status) searchParams.append('status', filters.status)
    if (filters.assigned_to) searchParams.append('assigned_to', filters.assigned_to.toString())
    if (filters.priority) searchParams.append('priority', filters.priority)
    if (filters.page) searchParams.append('page', filters.page.toString())
    if (filters.per_page) searchParams.append('per_page', filters.per_page.toString())

    const query = searchParams.toString()
    const endpoint = query 
      ? `/projects/${projectId}/tasks?${query}` 
      : `/projects/${projectId}/tasks`
    
    return apiClient.get<PaginatedResponse<Task>>(endpoint)
  },

  // Get all tasks (for dashboard)
  async listTasks(filters: ListTasksFilters = {}): Promise<PaginatedResponse<Task>> {
    const searchParams = new URLSearchParams()
    
    if (filters.status) searchParams.append('status', filters.status)
    if (filters.assigned_to) searchParams.append('assigned_to', filters.assigned_to.toString())
    if (filters.priority) searchParams.append('priority', filters.priority)
    if (filters.page) searchParams.append('page', filters.page.toString())
    if (filters.per_page) searchParams.append('per_page', filters.per_page.toString())

    const query = searchParams.toString()
    const endpoint = query ? `/tasks?${query}` : '/tasks'
    
    return apiClient.get<PaginatedResponse<Task>>(endpoint)
  },

  // Get single task
  async getTask(id: number): Promise<ApiResponse<Task>> {
    return apiClient.get<ApiResponse<Task>>(`/tasks/${id}`)
  },

  // Create new task
  async createTask(data: CreateTaskData): Promise<ApiResponse<Task>> {
    return apiClient.post<ApiResponse<Task>>('/tasks', data)
  },

  // Update task
  async updateTask(data: UpdateTaskData): Promise<ApiResponse<Task>> {
    const { id, ...updateData } = data
    return apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, updateData)
  },

  // Delete task
  async deleteTask(id: number): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(`/tasks/${id}`)
  },
}