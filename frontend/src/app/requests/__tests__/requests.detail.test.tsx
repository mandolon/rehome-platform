import { beforeAll, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import React from 'react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/msw'
import RequestDetailPage from '../[id]/page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}))

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:9000'

beforeAll(() => {
  server.use(
    http.get(`${baseUrl}/sanctum/csrf-cookie`, () => new HttpResponse(null, { status: 204 })),
    http.get(`${baseUrl}/api/requests/1`, () => {
      return HttpResponse.json({
        data: {
          id: 1,
          title: 'Fix login',
          status: 'open',
          creator: { id: 1, name: 'Alice', role: 'admin' },
          assignee: { id: 2, name: 'Bob', role: 'team', team_type: 'engineer' },
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          comments: [
            { id: 10, request_id: 1, body: 'First!', created_at: new Date().toISOString(), user: { id: 3, name: 'Cara', role: 'team' } }
          ],
        }
      })
    }),
    http.post(`${baseUrl}/api/requests/1/comment`, async ({ request }) => {
      const body = await request.json() as { body: string }
      return HttpResponse.json({
        data: { id: 11, request_id: 1, body: body.body, created_at: new Date().toISOString(), user: { id: 99, name: 'Test', role: 'team' } }
      }, { status: 201 })
    })
  )
})

describe('Request detail page', () => {
  it('renders meta and allows submitting a comment', async () => {
    render(<RequestDetailPage params={{ id: '1' }} />)

    await waitFor(() => expect(screen.getByText('Fix login')).toBeInTheDocument())
    expect(screen.getByTestId('status-open')).toBeInTheDocument()

    const textarea = screen.getByPlaceholderText('Write a comment...') as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: 'hello world' } })
    const submit = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submit)

    await waitFor(() => expect(screen.getByText('hello world')).toBeInTheDocument())
  })
})
