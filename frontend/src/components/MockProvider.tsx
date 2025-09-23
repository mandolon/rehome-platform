'use client'

import { useEffect } from 'react'

export function MockProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('MockProvider: NEXT_PUBLIC_USE_API_MOCK =', process.env.NEXT_PUBLIC_USE_API_MOCK)
    
    if (process.env.NEXT_PUBLIC_USE_API_MOCK === '1' && typeof window !== 'undefined') {
      console.log('MockProvider: Starting MSW...')
      // Start MSW in development
      import('../mocks/browser').then(({ worker }) => {
        worker.start({
          onUnhandledRequest: 'warn', // Warn about unhandled requests to debug
          serviceWorker: {
            url: '/mockServiceWorker.js',
          },
        }).then(() => {
          console.log('MSW: Service worker started successfully')
          console.log('MSW: Number of handlers:', worker.listHandlers().length)
        }).catch((error) => {
          console.error('MSW: Failed to start service worker:', error)
        })
      }).catch((error) => {
        console.error('MockProvider: Failed to import MSW browser module:', error)
      })
    } else {
      console.log('MockProvider: MSW disabled or not in browser environment')
    }
  }, [])

  return <>{children}</>
}