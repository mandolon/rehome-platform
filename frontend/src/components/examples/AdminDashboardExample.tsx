/**
 * Example usage of the Filament Resource hooks for admin-only visibility
 * This demonstrates the scaffolded hooks working correctly for role-based access control
 */
'use client'

import React from 'react'
import { 
  useFilamentResources, 
  FilamentResourceGuard, 
  AdminSectionGuard,
  FilamentResourceType 
} from '@/lib'

// Example admin dashboard component
export function AdminDashboard() {
  const { 
    canAccessResource, 
    isAdmin, 
    accessibleResources, 
    showAdminSection,
    getAccessibleNavigation 
  } = useFilamentResources()

  // Example navigation items
  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Projects', href: '/projects' },
    { label: 'User Management', href: '/admin/users', resourceType: 'users' as FilamentResourceType },
    { label: 'System Settings', href: '/admin/settings', adminOnly: true },
    { label: 'Admin Logs', href: '/admin/logs', resourceType: 'admin-logs' as FilamentResourceType },
    { label: 'File Manager', href: '/admin/files', resourceType: 'file-manager' as FilamentResourceType }
  ]

  const filteredNavigation = getAccessibleNavigation(navigationItems)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Platform Dashboard
        </h1>

        {/* Admin status display */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Access Control Status</h2>
          <div className="space-y-2">
            <p>Admin Status: <span className={`font-bold ${isAdmin ? 'text-green-600' : 'text-gray-600'}`}>
              {isAdmin ? 'Administrator' : 'Regular User'}
            </span></p>
            <p>Show Admin Section: <span className="font-bold">
              {showAdminSection ? 'Yes' : 'No'}
            </span></p>
            <p>Accessible Resources: <span className="font-bold">
              {accessibleResources.length}
            </span></p>
          </div>
        </div>

        {/* Navigation demonstration */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filtered Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredNavigation.map((item, index) => (
              <div 
                key={index}
                className={`p-3 rounded border ${
                  item.adminOnly || item.resourceType 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-gray-600">{item.href}</div>
                {item.adminOnly && (
                  <span className="inline-block text-xs bg-red-100 text-red-800 px-2 py-1 rounded mt-1">
                    Admin Only
                  </span>
                )}
                {item.resourceType && (
                  <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1">
                    {item.resourceType}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resource access examples */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Admin-only section */}
          <AdminSectionGuard>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-600">
                🔐 Admin-Only Section
              </h2>
              <p className="text-gray-600">
                This content is only visible to administrators.
              </p>
              <div className="mt-4 space-y-2">
                <div>✅ User Management</div>
                <div>✅ System Settings</div>
                <div>✅ Admin Logs</div>
                <div>✅ File Manager</div>
              </div>
            </div>
          </AdminSectionGuard>

          {/* Specific resource guard */}
          <FilamentResourceGuard resourceType="users">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-600">
                👥 User Management
              </h2>
              <p className="text-gray-600">
                This user management section is protected by Filament resource access control.
              </p>
              <div className="mt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Manage Users
                </button>
              </div>
            </div>
          </FilamentResourceGuard>
        </div>

        {/* Resource access check examples */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Resource Access Checks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['users', 'settings', 'admin-logs', 'file-manager'] as FilamentResourceType[]).map((resource) => (
              <div 
                key={resource} 
                className={`p-3 rounded text-center ${
                  canAccessResource(resource) 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="font-medium capitalize">{resource.replace('-', ' ')}</div>
                <div className={`text-sm ${
                  canAccessResource(resource) ? 'text-green-600' : 'text-red-600'
                }`}>
                  {canAccessResource(resource) ? '✅ Accessible' : '❌ Restricted'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard