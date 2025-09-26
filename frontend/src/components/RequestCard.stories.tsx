import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { RequestCard } from './RequestCard'

const meta: Meta<typeof RequestCard> = {
  title: 'Components/RequestCard',
  component: RequestCard,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Displays a single request with status, requester/assignee, and updated date.' } },
  },
  argTypes: {
    request: { control: 'object', description: 'Request data model' },
  },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RequestCard>

const base = {
  id: 'REQ-123',
  title: 'Fix login redirect loop',
  requester: 'Alice Smith',
  assignee: 'Bob Johnson',
  status: 'open' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  summary: 'Users are being redirected to /login repeatedly after successful authentication.'
}

export const Open: Story = {
  args: {
    request: { ...base, status: 'open' },
  },
}

export const InReview: Story = {
  args: {
    request: { ...base, status: 'in_review' },
  },
}

export const Resolved: Story = {
  args: {
    request: { ...base, status: 'resolved' },
  },
}

export const Unassigned: Story = {
  args: {
    request: { ...base, assignee: null },
  },
}
