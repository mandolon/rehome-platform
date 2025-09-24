'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RequestCard } from '@/components/RequestCard'
import requestsData from '@/data/requests.json'

type RequestStatus = 'open' | 'in_review' | 'resolved'

interface Request {
  id: string
  title: string
  requester: string
  assignee: string | null
  status: RequestStatus
  createdAt: string
  updatedAt: string
  summary?: string
}

export default function RequestsPage() {
  const [requests] = useState<Request[]>(requestsData as Request[])
  
  
  const filterRequestsByStatus = (status: RequestStatus) => {
    return requests.filter(request => request.status === status)
  }

  const openRequests = filterRequestsByStatus('open')
  const inReviewRequests = filterRequestsByStatus('in_review')
  const resolvedRequests = filterRequestsByStatus('resolved')

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Requests</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track all project requests
        </p>
      </div>

      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="open" className="flex items-center gap-2">
            Open
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {openRequests.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="in_review" className="flex items-center gap-2">
            In Review
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              {inReviewRequests.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center gap-2">
            Resolved
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {resolvedRequests.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-6">
          <div className="grid gap-4">
            {openRequests.length > 0 ? (
              openRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No open requests found
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="in_review" className="mt-6">
          <div className="grid gap-4">
            {inReviewRequests.length > 0 ? (
              inReviewRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No requests in review
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="resolved" className="mt-6">
          <div className="grid gap-4">
            {resolvedRequests.length > 0 ? (
              resolvedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No resolved requests
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}