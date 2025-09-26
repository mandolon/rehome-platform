import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/msw'
import RequestsPage from '../page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}))

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:9000'

beforeAll(() => {
  server.use(
    http.get(`${baseUrl}/sanctum/csrf-cookie`, () => {
      return new HttpResponse(null, { status: 204, headers: { 'Set-Cookie': 'XSRF-TOKEN=mock' } })
    }),
    http.get(`${baseUrl}/api/requests`, () => {
      return HttpResponse.json({
        data: [
          {
            id: 1,
            title: 'Fix login',
            status: 'open',
            creator: { id: 1, name: 'Alice', role: 'admin' },
            assignee: { id: 2, name: 'Bob', role: 'team', team_type: 'engineer' },
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            title: 'Design hero section',
            status: 'in_progress',
            creator: { id: 3, name: 'Cara', role: 'team', team_type: 'designer' },
            assignee: null,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
        ],
      })
    })
  )
})

// Next.js app dir pages expect to run in browser-like env; jsdom is configured.

describe('Requests list page', () => {
  it('renders rows with status badges and user badge', async () => {
    render(<RequestsPage />)

    await waitFor(() => {
      expect(screen.getByTestId('row-1')).toBeInTheDocument()
      expect(screen.getByTestId('row-2')).toBeInTheDocument()
    })

    expect(screen.getByTestId('status-open')).toBeInTheDocument()
  })
})
