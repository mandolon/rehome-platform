import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { Protected } from '@/components/auth/Protected'
import { useAuth } from '@/lib/auth/AuthProvider'
import type { User } from '@/lib/types'

// Mock dependencies
vi.mock('next/navigation')
vi.mock("@/lib/auth/AuthProvider")

const user: User = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
  created_at: '2023-01-01',
  updated_at: '2023-01-01',
}
const mockPush = vi.fn()
const mockUseRouter = vi.mocked(useRouter)
const mockUseAuth = vi.mocked(useAuth)

describe('Protected Component', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      // Add other router methods as needed
    } as any)
  })

  it('should show loading skeleton when loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshMe: vi.fn(),
    })

    render(
      <Protected>
        <div>Protected Content</div>
      </Protected>
    )

    // Should show loading state, not content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should redirect to login when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshMe: vi.fn(),
    })

    render(
      <Protected>
        <div>Protected Content</div>
      </Protected>
    )

    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('should render children when authenticated', () => {
    const user: User = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin',
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
    }
    mockUseAuth.mockReturnValue({
      user,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshMe: vi.fn(),
    })

    render(
      <Protected>
        <div>Protected Content</div>
      </Protected>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})