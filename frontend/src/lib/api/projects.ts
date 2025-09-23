import { apiClient } from './apiClient'
import { Project, ApiResponse, PaginatedResponse, ProjectStatus } from '@/lib/types'

interface ListProjectsParams {
  q?: string
  status?: ProjectStatus
  page?: number
  per_page?: number
}

interface CreateProjectData {
  name: string
  description?: string
  status?: ProjectStatus
  start_date?: string
  end_date?: string
}

interface UpdateProjectData extends Partial<CreateProjectData> {
  id: number
}

export const projectsApi = {
  // List projects with filters and pagination
  async listProjects(params: ListProjectsParams = {}): Promise<PaginatedResponse<Project>> {
    const searchParams = new URLSearchParams()
    
    if (params.q) searchParams.append('q', params.q)
    if (params.status) searchParams.append('status', params.status)
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.per_page) searchParams.append('per_page', params.per_page.toString())

    const query = searchParams.toString()
    const endpoint = query ? `/projects?${query}` : '/projects'
    
    return apiClient.get<PaginatedResponse<Project>>(endpoint)
  },

  // Get single project
  async getProject(id: number): Promise<ApiResponse<Project>> {
    return apiClient.get<ApiResponse<Project>>(`/projects/${id}`)
  },

  // Create new project
  async createProject(data: CreateProjectData): Promise<ApiResponse<Project>> {
    return apiClient.post<ApiResponse<Project>>('/projects', data)
  },

  // Update project
  async updateProject(data: UpdateProjectData): Promise<ApiResponse<Project>> {
    const { id, ...updateData } = data
    return apiClient.put<ApiResponse<Project>>(`/projects/${id}`, updateData)
  },

  // Delete project
  async deleteProject(id: number): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(`/projects/${id}`)
  },
}