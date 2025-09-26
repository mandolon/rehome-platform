import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { RoleGate } from './RoleGate'

const meta: Meta<typeof RoleGate> = {
  title: 'Auth/RoleGate',
  component: RoleGate,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Renders children based on area access. area="admin" shows content only to admin users; area="app" shows to any logged-in user.' } },
  },
  argTypes: {
    area: {
      control: 'inline-radio',
      options: ['admin', 'app'],
      description: 'Area to guard',
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
    area: 'app',
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
    area: 'admin',
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
    area: 'app',
    fallback: <div style={{ padding: 16 }}>Please log in</div>,
    children: <div style={{ padding: 16 }}>Private content</div>,
  },
  parameters: {
    globals: { role: 'guest' },
  },
}
