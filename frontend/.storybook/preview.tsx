import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
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
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Configuration for accessibility addon
      config: {
        rules: [
          {
            // Disable color-contrast rule for now during development
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations  
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },

  globalTypes: {
    darkMode: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.darkMode || 'light'
      
      return (
        <div className={theme === 'dark' ? 'dark' : ''}>
          <div className="min-h-screen bg-background text-foreground p-4">
            <Story />
          </div>
        </div>
      )
    },
  ],
}

export default preview
