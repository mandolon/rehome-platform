'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UserBadge } from '@/components/examples/UserBadge'
import { StatusBadge } from '@/components/requests/StatusBadge'

import type { Request } from '@/types/requests'

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

export default function RequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<Request[]>([])
  const [filter, setFilter] = useState<'all' | 'mine' | 'assigned' | 'open' | 'in_progress' | 'closed'>('all')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const baseUrl = getBaseUrl()
        await ensureCsrf(baseUrl)
        const res = await fetch(`${baseUrl}/api/requests`, { credentials: 'include' })
        if (res.status === 401) {
          router.push('/login')
          return
        }
        if (!res.ok) throw new Error('Failed to load requests')
        const data = await res.json()
        setRequests(Array.isArray(data.data) ? data.data : data)
      } catch (e: any) {
        setError(e?.message ?? 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [router])

  const filtered = useMemo(() => {
    switch (filter) {
      case 'mine':
        // assumes backend supplies current_user_id on each item or separate field; fallback to all
        return requests
      case 'assigned':
        return requests.filter(r => !!r.assignee)
      case 'open':
        return requests.filter(r => r.status === 'open')
      case 'in_progress':
        return requests.filter(r => r.status === 'in_progress')
      case 'closed':
        return requests.filter(r => r.status === 'closed')
      default:
        return requests
    }
  }, [filter, requests])

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Requests</h1>
          <p className="text-muted-foreground mt-2">Manage and track all project requests</p>
        </div>
        <div className="flex gap-2">
          {(['all','mine','assigned','open','in_progress','closed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm px-3 py-1 rounded border ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            >
              {f.replace('_',' ')}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="text-muted-foreground">Loading...</div>}
      {error && <div className="text-destructive">{error}</div>}

      {!loading && !error && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} data-testid={`row-${r.id}`}>
                  <TableCell className="font-mono text-xs">
                    <Link href={`/requests/${r.id}`} className="underline">{r.id}</Link>
                  </TableCell>
                  <TableCell>{r.title}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell>{r.assignee ? <UserBadge user={r.assignee} /> : <Badge variant="outline">Unassigned</Badge>}</TableCell>
                  <TableCell>{new Date(r.updated_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No requests</div>
          )}
        </div>
      )}
    </div>
  )
}