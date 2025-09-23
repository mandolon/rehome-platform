'use client'

import { useAuth } from '@/lib/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface ProtectedProps {
  children: React.ReactNode
}

export function Protected({ children }: ProtectedProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-7xl space-y-4">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return <>{children}</>
}