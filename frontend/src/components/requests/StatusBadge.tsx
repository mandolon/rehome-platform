import React from 'react'
import { Badge } from '@/components/ui/badge'

export type RequestStatus = 'open' | 'in_progress' | 'closed'

export function StatusBadge({ status }: { status: RequestStatus }) {
  const variant: 'secondary' | 'outline' = status === 'open'
    ? 'outline'
    : status === 'in_progress'
    ? 'secondary'
    : 'secondary'

  const label = status.replace('_', ' ')

  return <Badge variant={variant} data-testid={`status-${status}`}>{label}</Badge>
}
