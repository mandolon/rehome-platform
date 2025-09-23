'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { projectsApi } from '@/lib/api/projects'
import { tasksApi } from '@/lib/api/tasks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RoleGate } from '@/components/auth/RoleGate'
import { Project, Task, TaskStatus, Priority } from '@/lib/types'
import { ArrowLeft, Plus, Calendar, Users, CheckSquare } from 'lucide-react'

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = Number(params.id)
  
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [tasksLoading, setTasksLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectsApi.getProject(projectId)
        setProject(response.data)
      } catch (error) {
        console.error('Failed to fetch project:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setTasksLoading(true)
        const response = await tasksApi.listTasksByProject(projectId, {
          status: statusFilter || undefined,
          per_page: 50,
        })
        setTasks(response.data)
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        setTasksLoading(false)
      }
    }

    fetchTasks()
  }, [projectId, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'progress':
        return 'bg-green-100 text-green-800'
      case 'planned':
      case 'redline':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'med':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <p className="text-muted-foreground mb-4">
          The project you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              {project.start_date && (
                <span className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  Started {new Date(project.start_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
        <RoleGate allow={['admin', 'project_manager']}>
          <div className="flex space-x-2">
            <Button variant="outline">Edit Project</Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </RoleGate>
      </div>

      {/* Project Overview */}
      {project.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Project Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter(task => task.status === 'completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.members_count || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="redline">Redline</TabsTrigger>
            <TabsTrigger value="progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>
                Complete list of tasks for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{task.title}</p>
                            {task.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {task.assigned_user?.name || 'Unassigned'}
                        </TableCell>
                        <TableCell>
                          {task.due_date 
                            ? new Date(task.due_date).toLocaleDateString()
                            : '-'
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {!tasksLoading && tasks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No tasks in this project yet</p>
                  <RoleGate allow={['admin', 'project_manager']}>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Task
                    </Button>
                  </RoleGate>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {['redline', 'progress', 'completed'].map((status) => (
          <TabsContent key={status} value={status}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{status} Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks
                      .filter(task => task.status === status)
                      .map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{task.title}</p>
                              {task.description && (
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {task.assigned_user?.name || 'Unassigned'}
                          </TableCell>
                          <TableCell>
                            {task.due_date 
                              ? new Date(task.due_date).toLocaleDateString()
                              : '-'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {tasks.filter(task => task.status === status).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No {status} tasks</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}