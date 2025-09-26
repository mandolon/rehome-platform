'use client'

import React from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { Role } from '@/lib/types'

interface RoleGateProps {
  allow: readonly Role[] | Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGate({ allow, children, fallback = null }: RoleGateProps) {
  const { user } = useAuth()

  if (!user || !allow.includes(user.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}