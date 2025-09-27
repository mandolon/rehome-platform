// Minimal role helper used across the app. This file is the canonical
// module for imports like `@/lib/auth-context`.
import { useAuth } from '@/lib/auth/AuthProvider'
import type { Role } from '@/lib/types'

type RoleInput = Role | string | Array<Role | string>

function normalizeRole(input: unknown): Role {
  const v = String(input ?? '').toLowerCase()
  if (v === 'admin') return 'admin'
  if (v === 'team') return 'team'
  if (v === 'consultant') return 'consultant'
  if (v === 'client') return 'client'
  return 'client'
}

export function useRole() {
  const { user } = useAuth()

  const userRole: Role = normalizeRole((user as any)?.role)

  const hasRole = (input: RoleInput): boolean => {
    const wants = (Array.isArray(input) ? input : [input]).map((w) =>
      normalizeRole(w)
    )
    if (wants.includes('admin')) return userRole === 'admin'
    return userRole !== 'admin'
  }

  const isAdmin = () => hasRole('admin')

  return { user, hasRole, isAdmin }
}