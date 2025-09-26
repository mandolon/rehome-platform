import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TopBar } from '@/components/layout/TopBar'
import { useAuth } from '@/lib/auth/AuthProvider'
import { User } from '@/lib/types'

// Mock the auth context
const mockLogout = vi.fn()

// Mock the useAuth hook
vi.mock('@/lib/auth/AuthProvider', () => ({
  useAuth: vi.fn(),
}))

const mockUseAuth = vi.mocked(useAuth)

const renderWithAuth = (user: User | null) => {
  mockUseAuth.mockReturnValue({
    user,
    logout: mockLogout,
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    refreshMe: vi.fn(),
  })

  return render(<TopBar />)
}

describe('TopBar RBAC and Labels', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Admin Link Visibility', () => {
    it('shows admin link only when user.role === "admin"', () => {
      const adminUser: User = {
        id: 1,
        name: 'Admin User',
        email: 'admin@test.com',
        role: 'admin',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      renderWithAuth(adminUser)

      expect(screen.getByText('Admin Panel')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Admin Panel' })).toHaveAttribute('href', '/admin')
    })

    it('hides admin link when user.role !== "admin"', () => {
      const teamUser: User = {
        id: 2,
        name: 'Team User',
        email: 'team@test.com',
        role: 'team',
        team_type: 'engineer',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      renderWithAuth(teamUser)

      expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
    })

    it('hides admin link for client users', () => {
      const clientUser: User = {
        id: 3,
        name: 'Client User',
        email: 'client@test.com',
        role: 'client',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      renderWithAuth(clientUser)

      expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
    })
  })

  describe('Team Type Chip Rendering', () => {
    it('renders team_type chip when present', () => {
      const teamUser: User = {
        id: 2,
        name: 'Team User',
        email: 'team@test.com',
        role: 'team',
        team_type: 'architect',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      renderWithAuth(teamUser)

      expect(screen.getByText('architect')).toBeInTheDocument()
    })

    it('renders different team_type chips correctly', () => {
      const teamTypes = ['architect', 'engineer', 'designer', 'consultant'] as const

      teamTypes.forEach((teamType) => {
        const teamUser: User = {
          id: 2,
          name: 'Team User',
          email: 'team@test.com',
          role: 'team',
          team_type: teamType,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        }

        const { unmount } = renderWithAuth(teamUser)

        expect(screen.getByText(teamType)).toBeInTheDocument()
        unmount()
      })
    })

    it('hides team_type chip when absent', () => {
      const teamUserWithoutType: User = {
        id: 2,
        name: 'Team User',
        email: 'team@test.com',
        role: 'team',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      renderWithAuth(teamUserWithoutType)

      // Should not show any team type badges
      expect(screen.queryByText('architect')).not.toBeInTheDocument()
      expect(screen.queryByText('engineer')).not.toBeInTheDocument()
      expect(screen.queryByText('designer')).not.toBeInTheDocument()
      expect(screen.queryByText('consultant')).not.toBeInTheDocument()
    })

    it('hides team_type chip for admin users even if present', () => {
      const adminUser: User = {
        id: 1,
        name: 'Admin User',
        email: 'admin@test.com',
        role: 'admin',
        team_type: 'architect', // Admin with team_type should not show it
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      renderWithAuth(adminUser)

      // Admin should show admin link but not team_type chip
      expect(screen.getByText('Admin Panel')).toBeInTheDocument()
      expect(screen.queryByText('architect')).not.toBeInTheDocument()
    })

    it('hides team_type chip for client users even if present', () => {
      const clientUser: User = {
        id: 3,
        name: 'Client User',
        email: 'client@test.com',
        role: 'client',
        team_type: 'engineer', // Client with team_type should not show it
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      renderWithAuth(clientUser)

      // Client should not show team_type chip or admin link
      expect(screen.queryByText('engineer')).not.toBeInTheDocument()
      expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
    })
  })

  describe('Role Badge Rendering', () => {
    it('renders role badge for all user types', () => {
      const roles = ['admin', 'team', 'client'] as const

      roles.forEach((role) => {
        const user: User = {
          id: 1,
          name: 'Test User',
          email: 'test@test.com',
          role,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        }

        const { unmount } = renderWithAuth(user)

        expect(screen.getByText(role)).toBeInTheDocument()
        unmount()
      })
    })
  })
})