import React, { createContext, useContext, useState } from 'react'

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

// RoleProvider for Storybook - simple wrapper that provides auth context
export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SBUser | null>({
    id: 1,
    name: 'Demo Admin',
    email: 'admin@storybook.local',
    role: 'ADMIN'
  })

  const mockAuthContext: SBAuthContextType = {
    user,
    loading: false,
    login: async (email: string, _password: string) => {
      // Mock login based on email
      if (email === 'admin@storybook.local') {
        setUser({ id: 1, name: 'Demo Admin', email, role: 'ADMIN' })
      } else {
        setUser({ id: 2, name: 'Demo User', email, role: 'CLIENT' })
      }
    },
    logout: async () => {
      setUser(null)
    },
    refreshUser: async () => {
      // Mock refresh
    }
  }

  return (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  )
}
