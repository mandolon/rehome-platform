import type { Preview } from '@storybook/react'
import React from 'react'
import { AuthContext } from '../src/lib/auth-context.storybook'

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: { disable: false },
    layout: 'fullscreen',
    options: {
      storySort: {
        order: ['Admin', ['Users', 'Workspaces'], 'Examples', 'Components']
      }
    }
  },
  globalTypes: {
    role: {
      name: 'Role',
      description: 'Mocked user role',
      defaultValue: 'ADMIN',
      toolbar: {
        icon: 'user',
        items: [
          { value: 'ADMIN', title: 'Admin' },
          { value: 'TEAM', title: 'Team' },
          { value: 'CONSULTANT', title: 'Consultant' },
          { value: 'CLIENT', title: 'Client' },
          { value: 'GUEST', title: 'Guest (unauthenticated)' }
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const role = context.globals.role as string
      const isGuest = role === 'GUEST'
      const user = isGuest
        ? null
        : { id: 1, name: 'Story User', email: 'story@demo.local', role }

      const value = {
        user,
        loading: false,
        login: async () => {},
        logout: async () => {},
        refreshUser: async () => {},
      }

      return React.createElement(
        AuthContext.Provider as any,
        { value: value as any },
        React.createElement(Story as any)
      )
    }
  ]
}

export default preview
