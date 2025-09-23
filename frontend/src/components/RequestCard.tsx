import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Clock, User } from 'lucide-react'

interface Request {
  id: string
  title: string
  requester: string
  assignee: string | null
  status: 'open' | 'in_review' | 'resolved'
  createdAt: string
  updatedAt: string
  summary?: string
}

interface RequestCardProps {
  request: Request
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800'
}

const statusLabels = {
  open: 'Open',
  in_review: 'In Review', 
  resolved: 'Resolved'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function RequestCard({ request }: RequestCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              <Link 
                href={`/requests/${request.id}`}
                className="hover:text-primary transition-colors"
              >
                {request.title}
              </Link>
            </CardTitle>
            {request.summary && (
              <p className="text-sm text-muted-foreground mt-1">
                {request.summary}
              </p>
            )}
          </div>
          <Badge 
            variant="secondary"
            className={statusColors[request.status]}
          >
            {statusLabels[request.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{request.requester}</span>
            </div>
            {request.assignee && (
              <div className="flex items-center gap-2">
                <span>→</span>
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    {getInitials(request.assignee)}
                  </AvatarFallback>
                </Avatar>
                <span>{request.assignee}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(request.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}