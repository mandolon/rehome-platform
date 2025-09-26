'use client'

import { useMemo } from 'react'
import { useRole } from '../auth-context'

/**
 * Filament resource types that may have visibility restrictions
 */
export type FilamentResourceType = 
  | 'users'
  | 'roles'
  | 'permissions' 
  | 'settings'
  | 'admin-logs'
  | 'system-health'
  | 'cache-management'
  | 'backup-management'
  | 'file-manager'
  | 'email-templates'
  | 'notifications'

/**
 * Filament resource visibility configuration
 * Maps resource types to required roles/permissions
 */
const FILAMENT_RESOURCE_CONFIG: Record<FilamentResourceType, {
  requiredRoles: string[]
  adminOnly: boolean
  description: string
}> = {
  users: {
    requiredRoles: ['admin'],
    adminOnly: true,
    description: 'User management and profiles'
  },
  roles: {
    requiredRoles: ['admin'],
    adminOnly: true,
    description: 'Role and permission management'
  },
  permissions: {
    requiredRoles: ['admin'],
    adminOnly: true,
    description: 'System permissions configuration'
  },
  settings: {
    requiredRoles: ['admin'],
    adminOnly: true,
    description: 'System settings and configuration'
  },
  'admin-logs': {
    requiredRoles: ['admin'],
    adminOnly: true,
    description: 'System and admin activity logs'
  },
  'system-health': {
    requiredRoles: ['admin'],
    adminOnly: true,
    description: 'System health monitoring and diagnostics'
  },
  'cache-management': {
    requiredRoles: ['admin'],
    adminOnly: true,
    description: 'Application cache management'
  },
  'backup-management': {
    requiredRoles: ['admin'],
    adminOnly: true,
    description: 'Database and file backup management'
  },
  'file-manager': {
    requiredRoles: ['admin'],
    adminOnly: true,
    description: 'System file management and uploads'
  },
  'email-templates': {
    requiredRoles: ['admin'],
    adminOnly: true,
    description: 'Email template management'
  },
  'notifications': {
    requiredRoles: ['admin'],
    adminOnly: true,
    description: 'System notification management'
  }
}

/**
 * Hook for managing Filament resource visibility and permissions
 * Primarily focused on admin-only resources but extensible for role-based access
 */
export function useFilamentResources() {
  const { user, hasRole, isAdmin } = useRole()

  /**
   * Check if user can access a specific Filament resource
   */
  const canAccessResource = useMemo(() => {
    return (resourceType: FilamentResourceType): boolean => {
      if (!user) return false
      
      const config = FILAMENT_RESOURCE_CONFIG[resourceType]
      
      // If resource is admin-only, check admin role
      if (config.adminOnly) {
        return isAdmin()
      }
      
      // Check if user has any of the required roles
      return config.requiredRoles.some(role => hasRole(role))
    }
  }, [user, hasRole, isAdmin])

  /**
   * Get list of accessible Filament resources for current user
   */
  const accessibleResources = useMemo(() => {
    if (!user) return []
    
    return Object.keys(FILAMENT_RESOURCE_CONFIG)
      .filter(resource => canAccessResource(resource as FilamentResourceType))
      .map(resource => ({
        type: resource as FilamentResourceType,
        config: FILAMENT_RESOURCE_CONFIG[resource as FilamentResourceType]
      }))
  }, [user, canAccessResource])

  /**
   * Get list of admin-only resources (for navigation, UI filtering, etc.)
   */
  const adminOnlyResources = useMemo(() => {
    return Object.entries(FILAMENT_RESOURCE_CONFIG)
      .filter(([, config]) => config.adminOnly)
      .map(([type, config]) => ({
        type: type as FilamentResourceType,
        config
      }))
  }, [])

  /**
   * Check if current user should see admin navigation/sections
   */
  const showAdminSection = useMemo(() => {
    return isAdmin()
  }, [isAdmin])

  /**
   * Get resource configuration for a specific resource type
   */
  const getResourceConfig = (resourceType: FilamentResourceType) => {
    return FILAMENT_RESOURCE_CONFIG[resourceType]
  }

  /**
   * Check if user has access to any admin resources
   * Useful for showing/hiding entire admin sections
   */
  const hasAdminAccess = useMemo(() => {
    return isAdmin()
  }, [isAdmin])

  /**
   * Get filtered navigation items based on user permissions
   */
  const getAccessibleNavigation = (navigationItems: Array<{
    label: string
    href: string
    resourceType?: FilamentResourceType
    adminOnly?: boolean
  }>) => {
    return navigationItems.filter(item => {
      if (item.adminOnly && !isAdmin()) {
        return false
      }
      
      if (item.resourceType && !canAccessResource(item.resourceType)) {
        return false
      }
      
      return true
    })
  }

  return {
    // User info
    user,
    isAdmin: isAdmin(),
    
    // Resource access checks
    canAccessResource,
    hasAdminAccess,
    showAdminSection,
    
    // Resource lists
    accessibleResources,
    adminOnlyResources,
    
    // Utilities
    getResourceConfig,
    getAccessibleNavigation
  }
}

/**
 * Simple access control utility functions
 */
export const FilamentResourceUtils = {
  /**
   * Check if a resource type is admin-only
   */
  isAdminOnlyResource: (resourceType: FilamentResourceType): boolean => {
    return FILAMENT_RESOURCE_CONFIG[resourceType]?.adminOnly || false
  },
  
  /**
   * Get all admin-only resource types
   */
  getAdminOnlyResourceTypes: (): FilamentResourceType[] => {
    return Object.keys(FILAMENT_RESOURCE_CONFIG)
      .filter(key => FILAMENT_RESOURCE_CONFIG[key as FilamentResourceType].adminOnly)
      .map(key => key as FilamentResourceType)
  },
  
  /**
   * Get resource description
   */
  getResourceDescription: (resourceType: FilamentResourceType): string => {
    return FILAMENT_RESOURCE_CONFIG[resourceType]?.description || ''
  }
}