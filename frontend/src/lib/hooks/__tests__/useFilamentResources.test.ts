/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFilamentResources, FilamentResourceUtils } from '../useFilamentResources'

vi.mock('../../auth-context', () => ({
  useRole: vi.fn(),
}))
import { useRole } from '../../auth-context'
const mockUseRole = vi.mocked(useRole)

describe('useFilamentResources', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when user is admin', () => {
    beforeEach(() => {
      mockUseRole.mockReturnValue({
        user: { id: 1, name: 'Admin User', email: 'admin@test.com', role: 'admin' },
        hasRole: vi.fn((role) => (Array.isArray(role) ? role.includes('admin') : role === 'admin')),
        isAdmin: vi.fn(() => true)
      } as any)
    })

    it('should allow access to all admin-only resources', () => {
      const { result } = renderHook(() => useFilamentResources())
      
      expect(result.current.isAdmin).toBe(true)
      expect(result.current.accessibleResources.map(r => r.type)).toContain('settings')
    })
  })

  describe('when user is not admin', () => {
    beforeEach(() => {
      mockUseRole.mockReturnValue({
        user: { id: 2, name: 'Regular User', email: 'user@test.com', role: 'team' },
        hasRole: vi.fn((role) => (Array.isArray(role) ? role.includes('team') : role === 'team')),
        isAdmin: vi.fn(() => false)
      } as any)
    })

    it('should not allow access to admin-only resources', () => {
      const { result } = renderHook(() => useFilamentResources())
      
      expect(result.current.isAdmin).toBe(false)
      expect(result.current.showAdminSection).toBe(false)
      expect(result.current.canAccessResource('users')).toBe(false)
      expect(result.current.canAccessResource('settings')).toBe(false)
      expect(result.current.canAccessResource('admin-logs')).toBe(false)
    })

    it('should return empty accessible resources list', () => {
      const { result } = renderHook(() => useFilamentResources())
      
      expect(result.current.accessibleResources).toHaveLength(0)
    })
  })

  describe('when user is not logged in', () => {
    beforeEach(() => {
      mockUseRole.mockReturnValue({
        user: null,
        hasRole: vi.fn(() => false),
        isAdmin: vi.fn(() => false)
      } as any)
    })

    it('should not allow access to any resources', () => {
      const { result } = renderHook(() => useFilamentResources())
      
      expect(result.current.user).toBe(null)
      expect(result.current.isAdmin).toBe(false)
      expect(result.current.canAccessResource('users')).toBe(false)
      expect(result.current.accessibleResources).toHaveLength(0)
    })
  })

  describe('getAccessibleNavigation', () => {
    beforeEach(() => {
      mockUseRole.mockReturnValue({
        user: { id: 1, name: 'Admin User', email: 'admin@test.com', role: 'admin' },
        hasRole: vi.fn((role) => (Array.isArray(role) ? role.includes('admin') : role === 'admin')),
        isAdmin: vi.fn(() => true)
      } as any)
    })

    it('should filter navigation items based on access', () => {
      const { result } = renderHook(() => useFilamentResources())
      
      const navItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Users', href: '/admin/users', resourceType: 'users' as const },
        { label: 'Settings', href: '/admin/settings', adminOnly: true },
        { label: 'Public Page', href: '/public' }
      ]
      
      const accessible = result.current.getAccessibleNavigation(navItems)
      expect(accessible).toHaveLength(4) // Admin can see all
    })
  })
})

describe('FilamentResourceUtils', () => {
  it('should identify admin-only resources', () => {
    expect(FilamentResourceUtils.isAdminOnlyResource('users')).toBe(true)
    expect(FilamentResourceUtils.isAdminOnlyResource('settings')).toBe(true)
  })

  it('should return all admin-only resource types', () => {
    const adminResources = FilamentResourceUtils.getAdminOnlyResourceTypes()
    expect(adminResources).toContain('users')
    expect(adminResources).toContain('settings')
    expect(adminResources).toContain('admin-logs')
    expect(adminResources).toHaveLength(12) // All resources are admin-only in current config
  })

  it('should return resource descriptions', () => {
    expect(FilamentResourceUtils.getResourceDescription('users')).toBe('User management and profiles')
    expect(FilamentResourceUtils.getResourceDescription('settings')).toBe('System settings and configuration')
  })
})