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
  typescript: { check: false },
  viteFinal: async (config) => {
    const tsconfigPaths = (await import("vite-tsconfig-paths")).default;
    config.plugins = [...(config.plugins || []), tsconfigPaths()];
    config.build = { ...(config.build || {}), sourcemap: false };
    config.css = { ...(config.css || {}), devSourcemap: false };
    config.resolve = {
      ...(config.resolve || {}),
      alias: {
        ...(config.resolve?.alias || {}),
        '@/lib/auth-context': '/src/lib/auth-context.storybook.tsx',
        'next/navigation': '/public/__sb_mocks__/next-navigation.ts',
        'next/link': '/public/__sb_mocks__/next-link.tsx',
        'next/image': '/public/__sb_mocks__/next-image.tsx',
        '@': '/src'
      }
    };
    return config;
  }
}

export default config
