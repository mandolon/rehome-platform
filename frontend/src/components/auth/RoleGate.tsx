'use client'

import React from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'

interface RoleGateProps {
  area: 'admin' | 'app'
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGate({ area, children, fallback = null }: RoleGateProps) {
  const { user } = useAuth()

  // For admin area, only show to admin users
  if (area === 'admin') {
    if (!user || String(user.role).toLowerCase() !== 'admin') {
      return <>{fallback}</>
    }
    return <>{children}</>
  }

  // For app area, show to any logged-in user (including admin)
  if (!user) return <>{fallback}</>

  return <>{children}</>
}