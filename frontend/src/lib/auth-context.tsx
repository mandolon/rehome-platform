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
  
  const value: AuthContextType = {
    const roles = Array.isArray(role) ? role : [role]
    
    // Map new roles to legacy format for compatibility
    const roleMap: Record<string, string> = {
      'ADMIN': 'admin',
      'TEAM': 'user',
      'CONSULTANT': 'user', 
      'CLIENT': 'user'
    }
    
    const normalizedRole = roleMap[user.role] || 'user'
    return roles.includes(normalizedRole)
  }

  const isAdmin = () => hasRole('admin')

  return {
    user,
    hasRole,
    isAdmin,
  }
}
