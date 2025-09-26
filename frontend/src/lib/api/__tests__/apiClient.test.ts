import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient } from '@/lib/api/apiClient'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('ApiClient', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('csrf', () => {
    it('should call CSRF endpoint without /api', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers(),
      })

      await apiClient.csrf()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:9000/sanctum/csrf-cookie',
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        }
      )
    })
  })

  describe('request', () => {
    it('should include credentials in all requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ data: 'test' }),
      })

      await apiClient.get('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:9000/api/app/test',
        expect.objectContaining({
          credentials: 'include',
        })
      )
    })

    it('should throw ApiError on HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ message: 'Bad Request' }),
      })

      await expect(apiClient.get('/test')).rejects.toEqual({
        message: 'Bad Request',
        status: 400,
        errors: undefined,
      })
    })
  })
})