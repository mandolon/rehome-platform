'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { login as authLogin, logout as authLogout, me as getMe } from './auth'

interface User {
  id: number
  name: string
  email: string
  role: string
  profile?: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check authentication status on app load
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const user = await getMe()
      setUser(user)
    } catch (error) {
      // User not authenticated, clear any stale state
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await authLogin(email, password)
      setUser(response.user)
      router.push('/dashboard')
    } catch (error) {
      setLoading(false)
      throw error // Re-throw for component error handling
    }
    setLoading(false)
  }

  const logout = async () => {
    try {
      await authLogout()
    } catch (error) {
      console.warn('Logout request failed, clearing local state anyway')
    } finally {
      setUser(null)
      router.push('/login')
    }
  }

  const refreshUser = async () => {
    try {
      const user = await getMe()
      setUser(user)
    } catch (error) {
      // If refresh fails, user is no longer authenticated
      setUser(null)
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login')
      }
    }, [user, loading, router])

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      )
    }

    if (!user) {
      return null // Will redirect to login
    }

    return <Component {...props} />
  }
}

// Role-based access control
export function useRole() {
  const { user } = useAuth()
  
  const hasRole = (role: string | string[]) => {
    if (!user) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(user.role)
  }

  const isAdmin = () => hasRole('admin')
  const isProjectManager = () => hasRole(['admin', 'project_manager'])
  const isTeamMember = () => hasRole(['admin', 'project_manager', 'team_member'])

  return {
    user,
    hasRole,
    isAdmin,
    isProjectManager,
    isTeamMember,
  }
}
