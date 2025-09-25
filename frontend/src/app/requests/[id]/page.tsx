'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserBadge } from '@/components/examples/UserBadge'
import { StatusBadge } from '@/components/requests/StatusBadge'
import type { Request, RequestComment } from '@/types/requests'

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:9000'
}

function getCookie(name: string) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

async function ensureCsrf(baseUrl: string) {
  if (!getCookie('XSRF-TOKEN')) {
    await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: 'include' })
  }
}

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [request, setRequest] = useState<Request | null>(null)
  const [comments, setComments] = useState<RequestComment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [commentBody, setCommentBody] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        const baseUrl = getBaseUrl()
        await ensureCsrf(baseUrl)
        const res = await fetch(`${baseUrl}/api/requests/${params.id}`, { credentials: 'include' })
        if (res.status === 401) {
          router.push('/login')
          return
        }
        if (!res.ok) throw new Error('Failed to load request')
        const data = await res.json()
        const rq = data.data ?? data
        setRequest(rq)
        setComments(rq.comments ?? [])
      } catch (e: any) {
        setError(e?.message ?? 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const baseUrl = getBaseUrl()
    await ensureCsrf(baseUrl)
    const res = await fetch(`${baseUrl}/api/requests/${params.id}/comment`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: commentBody }),
    })
    if (res.status === 401) {
      router.push('/login')
      return
    }
    if (!res.ok) return
    const saved = await res.json()
    const newComment = saved.data ?? saved
    setComments((prev) => [newComment, ...prev])
    setCommentBody('')
  }

  if (loading) return <div className="container mx-auto p-6">Loading...</div>
  if (error) return <div className="container mx-auto p-6 text-destructive">{error}</div>
  if (!request) return <div className="container mx-auto p-6">Not found</div>

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{request.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={request.status} />
            {request.assignee ? <UserBadge user={request.assignee} /> : <Badge variant="outline">Unassigned</Badge>}
          </div>
        </div>
        <Link href="/requests" className="underline">Back to list</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Creator:</span> <UserBadge user={request.creator} /></div>
            <div><span className="text-muted-foreground">Assignee:</span> {request.assignee ? <UserBadge user={request.assignee} /> : '—'}</div>
            <div><span className="text-muted-foreground">Updated:</span> {new Date(request.updated_at).toLocaleString()}</div>
            <div><span className="text-muted-foreground">Created:</span> {new Date(request.created_at).toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3 mb-6">
            <textarea value={commentBody} onChange={(e:any) => setCommentBody(e.target.value)} placeholder="Write a comment..." className="w-full border rounded p-2 min-h-[100px]" />
            <Button type="submit" disabled={!commentBody.trim()}>Submit</Button>
          </form>
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="border rounded p-3">
                <div className="flex items-center justify-between text-sm">
                  <UserBadge user={c.user} />
                  <span className="text-muted-foreground">{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <div className="mt-2 whitespace-pre-wrap">{c.body}</div>
              </div>
            ))}
            {comments.length === 0 && <div className="text-muted-foreground">No comments yet</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
