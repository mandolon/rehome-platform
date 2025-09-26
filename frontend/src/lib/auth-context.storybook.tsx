import React, { createContext } from 'react'

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
