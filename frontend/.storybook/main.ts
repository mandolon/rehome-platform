import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  stories: [
    '../src/**/*.stories.@(ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions'
  ],
  docs: {
    autodocs: true
  },
  viteFinal: async (config) => {
    // Ensure alias to avoid importing Next.js client module in Storybook
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@/lib/auth-context': '/src/lib/auth-context.storybook.tsx',
      '@': '/src'
    }
    return config
  }
}

export default config
