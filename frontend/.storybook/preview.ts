import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'
import React from 'react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: 'hsl(var(--background))',
        },
        {
          name: 'dark',
          value: 'hsl(var(--background))',
        },
      ],
    },
    a11y: {
      // Accessibility configuration
      config: {
        rules: [
          // Enable important a11y rules
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-order-semantics',
            enabled: true,
          },
          {
            id: 'keyboard-navigation',
            enabled: true,
          },
        ],
      },
      // Options: 'violations' | 'passes' | 'inapplicable'
      element: '#storybook-root',
      manual: false,
    },
    docs: {
      toc: true, // Enable table of contents
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      // Apply theme class to body
      const theme = context.globals.theme || 'light';
      document.body.className = theme === 'dark' ? 'dark' : '';
      
      return React.createElement(
        'div', 
        { className: 'min-h-screen bg-background text-foreground p-4' },
        React.createElement(Story)
      );
    },
  ],
}

export default preview
