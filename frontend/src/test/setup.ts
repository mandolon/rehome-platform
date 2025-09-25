import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { cleanup } from '@testing-library/react'
import { server } from './msw'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'

// Start MSW
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' })
})

// Reset handlers & clean React trees
afterEach(() => {
  server.resetHandlers()
  cleanup()
  vi.restoreAllMocks()
  vi.clearAllTimers()
})

// Close MSW so Vitest can exit
afterAll(() => {
  server.close()
})
