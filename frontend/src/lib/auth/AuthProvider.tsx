'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, LoginCredentials, RegisterData } from '@/lib/types'
import { login as apiLogin, logout as apiLogout, register as apiRegister, me as apiMe } from '@/lib/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Get current user on mount
  useEffect(() => {
    refreshMe()
  }, [])

  const refreshMe = async () => {
    try {
      setLoading(true)
      const response = await apiMe()
      setUser(response.data)
    } catch (error) {
      setUser(null)
      // Don't throw error for initial load - user might not be logged in
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiLogin(credentials)
      setUser(response.data)
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await apiRegister(data)
      setUser(response.data)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
      setUser(null)
    } catch (error) {
      // Even if logout fails on server, clear user locally
      setUser(null)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshMe,
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