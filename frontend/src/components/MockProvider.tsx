'use client'

import { useEffect } from 'react'

export function MockProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_API_MOCK === '1' && typeof window !== 'undefined') {
      // Start MSW in development
      import('../mocks/browser').then(({ worker }) => {
        worker.start({
          onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
        })
      })
    }
  }, [])

  return <>{children}</>
}