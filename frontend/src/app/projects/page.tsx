'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ProjectsPage() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Mock projects data - in real app this would come from API
  const projects = [
    {
      id: 1,
      name: 'Modern Office Complex',
      status: 'In Progress',
      progress: 65,
      dueDate: '2024-03-15',
      team: ['John Doe', 'Jane Smith', 'Mike Johnson']
    },
    {
      id: 2,
      name: 'Residential Tower',
      status: 'Planning',
      progress: 15,
      dueDate: '2024-06-30',
      team: ['Sarah Wilson', 'Tom Brown']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Rehome Platform
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="mt-2 text-gray-600">Manage your construction and architecture projects</p>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={() => alert('Create new project functionality coming soon!')}
            >
              New Project
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {projects.length === 0 ? (
              <li className="px-4 py-4 sm:px-6">
                <div className="text-center py-8 text-gray-500">
                  No projects found. Create your first project to get started.
                </div>
              </li>
            ) : (
              projects.map((project) => (
                <li key={project.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-600">
                          <span 
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              project.status === 'In Progress' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {project.status}
                          </span>
                          <span className="mx-2">•</span>
                          <span>Due: {project.dueDate}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600">Progress: {project.progress}%</span>
                            <div className="ml-3 flex-1 max-w-xs">
                              <div className="bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                          <span>Team: {project.team.join(', ')}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          onClick={() => alert('Project details functionality coming soon!')}
                        >
                          View
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800 font-medium"
                          onClick={() => alert('Edit project functionality coming soon!')}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}