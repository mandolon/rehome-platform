'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { projectsApi } from '@/lib/api/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { RoleGate } from '@/components/auth/RoleGate'
import { Project, ProjectStatus } from '@/lib/types'
import { Plus, Search, Filter } from 'lucide-react'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await projectsApi.listProjects({
          q: searchQuery || undefined,
          status: statusFilter || undefined,
          page: currentPage,
          per_page: 12,
        })
        
        setProjects(response.data)
        setTotalPages(response.meta.last_page)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [searchQuery, statusFilter, currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'planned':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your projects
          </p>
        </div>
        <RoleGate area="app">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </RoleGate>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | '')}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Statuses</option>
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
            <Button type="submit">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      <Link 
                        href={`/projects/${project.id}`}
                        className="hover:underline"
                      >
                        {project.name}
                      </Link>
                    </CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  {project.description && (
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{project.tasks_count || 0} tasks</span>
                    <span>{project.members_count || 0} members</span>
                  </div>
                  {(project.start_date || project.end_date) && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {project.start_date && (
                        <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
                      )}
                      {project.end_date && (
                        <span className="ml-2">Due: {new Date(project.end_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {projects.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-medium">No projects found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || statusFilter 
                      ? 'Try adjusting your search or filters'
                      : 'Get started by creating your first project'
                    }
                  </p>
                  <RoleGate area="app">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project
                    </Button>
                  </RoleGate>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}