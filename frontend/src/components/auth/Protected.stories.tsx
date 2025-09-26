import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Protected } from './Protected'

const meta: Meta<typeof Protected> = {
  title: 'Auth/Protected',
  component: Protected,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Gate component that renders children only when a user is authenticated. Shows a skeleton while loading and redirects to /login if unauthenticated.' } },
  },
  argTypes: {
    children: { control: false, description: 'Content to render when authenticated' },
  },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Protected>

export const Authenticated: Story = {
  name: 'Authenticated',
  args: {
    children: (
      <div style={{ padding: 16 }}>
        <h2>Private Dashboard</h2>
        <p>This content is visible because the mocked user is authenticated.</p>
      </div>
    ),
  },
  parameters: {
    globals: { role: 'admin' },
  },
}

export const GuestDoesNotRender: Story = {
  name: 'Guest (no render)',
  args: {
    children: (
      <div style={{ padding: 16 }}>
        <h2>Should Not Render</h2>
        <p>As a guest, this content should not appear (Protected returns null and would redirect in app).</p>
      </div>
    ),
  },
  parameters: {
    globals: { role: 'guest' },
  },
}
