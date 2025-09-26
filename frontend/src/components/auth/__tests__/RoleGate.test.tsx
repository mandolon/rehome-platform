import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RoleGate } from '@/components/auth/RoleGate'
import { useAuth } from '@/lib/auth/AuthProvider'
import { vi } from 'vitest'

// Mock the auth hook
vi.mock('@/lib/auth/AuthProvider')
const mockUseAuth = vi.mocked(useAuth)

describe('RoleGate Component (area-based)', () => {
  it('admin should see admin area', () => {
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
      <RoleGate area="admin">
        <div>Admin Content</div>
      </RoleGate>
    )

    expect(getByText('Admin Content')).toBeDefined()
  })

  it('non-admin should NOT see admin area', () => {
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
      <RoleGate area="admin">
        <div>Admin Content</div>
      </RoleGate>
    )

    expect(queryByText('Admin Content')).toBeNull()
  })

  it('any logged-in user should see app area; guests see fallback', () => {
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

    const { getByText, rerender } = render(
      <RoleGate area="app" fallback={<div>Access Denied</div>}>
        <div>App Content</div>
      </RoleGate>
    )
    expect(getByText('App Content')).toBeDefined()

    // Guest state should render fallback
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshMe: vi.fn(),
    })

    rerender(
      <RoleGate area="app" fallback={<div>Access Denied</div>}>
        <div>App Content</div>
      </RoleGate>
    )
    expect(getByText('Access Denied')).toBeDefined()
  })
})