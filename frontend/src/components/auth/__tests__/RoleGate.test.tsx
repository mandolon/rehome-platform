import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RoleGate } from '@/components/auth/RoleGate'
import { useAuth } from '@/lib/auth/AuthProvider'
import { vi } from 'vitest'

// Mock the auth hook
vi.mock('@/lib/auth/AuthProvider')
const mockUseAuth = vi.mocked(useAuth)

describe('RoleGate Component', () => {
  it('should render children when user has allowed role', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshMe: vi.fn(),
    })

    const { getByText } = render(
      <RoleGate allow={['admin', 'project_manager']}>
        <div>Admin Content</div>
      </RoleGate>
    )

    expect(getByText('Admin Content')).toBeDefined()
  })

  it('should not render children when user does not have allowed role', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'client',
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshMe: vi.fn(),
    })

    const { queryByText } = render(
      <RoleGate allow={['admin', 'project_manager']}>
        <div>Admin Content</div>
      </RoleGate>
    )

    expect(queryByText('Admin Content')).toBeNull()
  })

  it('should render fallback when user does not have allowed role', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'client',
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshMe: vi.fn(),
    })

    const { getByText } = render(
      <RoleGate allow={['admin']} fallback={<div>Access Denied</div>}>
        <div>Admin Content</div>
      </RoleGate>
    )

    expect(getByText('Access Denied')).toBeDefined()
  })
})