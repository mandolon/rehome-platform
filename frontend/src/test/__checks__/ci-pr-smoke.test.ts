import { describe, it, expect } from 'vitest'

// Minimal smoke test to exercise PR CI

describe('PR CI smoke', () => {
  it('runs in PR CI', () => {
    expect(true).toBe(true)
  })
})
