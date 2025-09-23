'use client';

import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { DashboardStats, Project } from '../types';
import { formatDate } from '../lib/utils';
import {
  ChartBarIcon,
  FolderIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, color }: {
  title: string;
  value: number | string;
  icon: any;
  color: string;
}) => (
  <div className="card p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const RecentProject = ({ project }: { project: Project }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="bg-primary-100 p-2 rounded-lg">
        <FolderIcon className="h-5 w-5 text-primary-600" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
        <p className="text-sm text-gray-500">
          {project.client_name} • {formatDate(project.created_at)}
        </p>
      </div>
    </div>
    <span className={`badge badge-${project.status === 'active' ? 'success' : project.status === 'completed' ? 'primary' : 'secondary'}`}>
      {project.status.replace('_', ' ')}
    </span>
  </div>
);

export default function DashboardPage() {
  const { user } = useAuth();
  
  const { data: dashboardData, isLoading } = useQuery(
    'dashboard',
    async () => {
      const response = await api.get('/dashboard');
      return response.data;
    }
  );

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const stats: DashboardStats = dashboardData?.stats || {
    total_projects: 0,
    active_projects: 0,
    completed_projects: 0,
    total_tasks: 0,
    completed_tasks: 0,
  };

  const recentProjects: Project[] = dashboardData?.projects || [];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your projects today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Projects"
              value={stats.total_projects}
              icon={FolderIcon}
              color="blue"
            />
            <StatCard
              title="Active Projects"
              value={stats.active_projects}
              icon={ChartBarIcon}
              color="green"
            />
            <StatCard
              title="Total Tasks"
              value={stats.total_tasks}
              icon={ClockIcon}
              color="yellow"
            />
            <StatCard
              title="Completed Tasks"
              value={stats.completed_tasks}
              icon={CheckCircleIcon}
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
              </div>
              <div className="p-6">
                {recentProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new project.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentProjects.map((project) => (
                      <RecentProject key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                    <FolderIcon className="h-5 w-5 mr-2" />
                    Create New Project
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    View My Tasks
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <UsersIcon className="h-5 w-5 mr-2" />
                    Manage Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}