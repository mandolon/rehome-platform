import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { RoleGate } from './RoleGate'
import type { Role } from '@/lib/types'

const meta: Meta<typeof RoleGate> = {
  title: 'Auth/RoleGate',
  component: RoleGate,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Renders children only if the mocked user role is included in the `allow` list. Uses global toolbar role from Storybook to simulate auth context.' } },
  },
  argTypes: {
    allow: {
      control: 'inline-check',
      options: ['admin', 'project_manager', 'team_member'] as Role[],
      description: 'Allowed roles',
    },
    fallback: { control: 'text' },
    children: { control: false },
  },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RoleGate>

export const AccessGranted: Story = {
  name: 'Access Granted',
  args: {
    allow: ['admin', 'project_manager'],
    fallback: <div style={{ padding: 16 }}>No Access</div>,
    children: <div style={{ padding: 16 }}>Secret content visible to allowed roles.</div>,
  },
  parameters: {
    globals: { role: 'admin' },
  },
}

export const AccessDenied: Story = {
  name: 'Access Denied',
  args: {
    allow: ['project_manager'],
    fallback: <div style={{ padding: 16 }}>No Access</div>,
    children: <div style={{ padding: 16 }}>This should not render for team_member.</div>,
  },
  parameters: {
    globals: { role: 'team_member' },
  },
}

export const GuestFallback: Story = {
  name: 'Guest (Fallback)',
  args: {
    allow: ['admin', 'project_manager', 'team_member'],
    fallback: <div style={{ padding: 16 }}>Please log in</div>,
    children: <div style={{ padding: 16 }}>Private content</div>,
  },
  parameters: {
    globals: { role: 'guest' },
  },
}
