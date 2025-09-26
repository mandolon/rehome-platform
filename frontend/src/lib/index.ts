/**
 * Filament Resource Hooks and Components
 * 
 * This module provides hooks and components for managing visibility and access
 * to Filament resources based on user roles, with primary focus on admin-only resources.
 */

export { 
  useFilamentResources,
  FilamentResourceUtils,
  type FilamentResourceType 
} from './hooks/useFilamentResources'

export {
  FilamentResourceGuard,
  AdminSectionGuard
} from '../components/auth/FilamentResourceGuard'