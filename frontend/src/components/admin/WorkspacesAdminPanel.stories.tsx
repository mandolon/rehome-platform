import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { WorkspacesAdminPanel } from './WorkspacesAdminPanel'
import { AdminSectionGuard } from '../auth/FilamentResourceGuard'

const meta: Meta<typeof WorkspacesAdminPanel> = {
  title: 'Admin/Workspaces/WorkspacesAdminPanel',
  component: WorkspacesAdminPanel,
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
  },
}
export default meta

type Story = StoryObj<typeof WorkspacesAdminPanel>

export const Default: Story = {
  name: 'List + Detail (Admin)',
  args: {},
  parameters: {
    globals: { role: 'admin' },
  },
}

export const HiddenForNonAdmins: Story = {
  name: 'Hidden for Non-Admins',
  render: () => (
    <AdminSectionGuard fallback={<div style={{ padding: 16 }}>No access</div>}>
      <WorkspacesAdminPanel />
    </AdminSectionGuard>
  ),
  parameters: {
    globals: { role: 'team_member' },
  },
}

export const AccessDeniedWhenGuest: Story = {
  name: 'Access Denied (Guest)',
  parameters: {
    globals: { role: 'guest' },
  },
  render: () => <WorkspacesAdminPanel />,
}
