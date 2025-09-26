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
      defaultValue: 'admin',
      toolbar: {
        icon: 'user',
        items: [
          { value: 'admin', title: 'Admin' },
          { value: 'project_manager', title: 'Project Manager' },
          { value: 'team_member', title: 'Team Member' },
          { value: 'guest', title: 'Guest (unauthenticated)' }
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const role = context.globals.role as string
      const isGuest = role === 'guest'
      const user = isGuest
        ? null
        : { id: 1, name: 'Story User', email: 'story@demo.local', role }

      const value = {
        user,
        loading: false,
        login: async () => {},
        register: async () => {},
        logout: async () => {},
        refreshMe: async () => {},
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
