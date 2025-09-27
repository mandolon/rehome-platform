import React, { createContext, useContext } from 'react'

// Storybook-friendly mock AuthContext (no Next.js router, no "use client")
export interface SBUser {
  id: number
  name: string
  email: string
  role: string
}

export interface SBAuthContextType {
  user: SBUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<SBAuthContextType | undefined>(undefined)

// Hook exports that match the production auth context
export function useRole() {
  const context = useContext(AuthContext)
  const user = context?.user || null
  
  return {
    user,
    hasRole: (role: string) => user?.role === role || user?.role === 'ADMIN',
    isAdmin: () => user?.role === 'ADMIN'
  }
}

export function useIsAdmin() {
  const { isAdmin } = useRole()
  return isAdmin()
}

export function useIsAppUser() {
  const { user } = useRole()
  return !!user
}
