import { describe, it, expect } from 'vitest'

// The MSW server is started/stopped in src/test/setup.ts
// This test exercises the trivial /api/health handler.

describe('MSW /api/health', () => {
  it('returns ok: true', async () => {
    const res = await fetch('/api/health')
    expect(res.ok).toBe(true)
    const data = await res.json()
    expect(data).toEqual({ ok: true })
  })
})
