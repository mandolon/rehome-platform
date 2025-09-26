'use client'

import { ReactNode } from 'react'
import { useFilamentResources, FilamentResourceType } from '../../lib/hooks/useFilamentResources'

interface FilamentResourceGuardProps {
  children: ReactNode
  resourceType: FilamentResourceType
  fallback?: ReactNode
  loadingComponent?: ReactNode
}

/**
 * Component that guards access to Filament resources based on user permissions
 * Shows children only if user has access to the specified resource type
 */
export function FilamentResourceGuard({ 
  children, 
  resourceType, 
  fallback,
  loadingComponent 
}: FilamentResourceGuardProps) {
  const { canAccessResource, user } = useFilamentResources()
  
  // Show loading state while checking auth
  if (!user) {
    if (loadingComponent) {
      return <>{loadingComponent}</>
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }
  
  // Check access
  if (!canAccessResource(resourceType)) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this resource.
          </p>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}

interface AdminSectionGuardProps {
  children: ReactNode
  fallback?: ReactNode
  loadingComponent?: ReactNode
}

/**
 * Component that guards admin-only sections
 * Shows children only if user is admin
 */
export function AdminSectionGuard({ 
  children, 
  fallback,
  loadingComponent 
}: AdminSectionGuardProps) {
  const { isAdmin, user } = useFilamentResources()
  
  // Show loading state while checking auth
  if (!user) {
    if (loadingComponent) {
      return <>{loadingComponent}</>
    }
    
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    )
  }
  
  // Check admin access
  if (!isAdmin) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    return null // Hide section completely for non-admins
  }
  
  return <>{children}</>
}