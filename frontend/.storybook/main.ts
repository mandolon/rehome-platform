import type { StorybookConfig } from 'storybook';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  framework: { name: '@storybook/react-vite', options: {} },
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-actions',
    '@storybook/addon-controls',
    '@storybook/addon-backgrounds',
    '@storybook/addon-outline',
    '@storybook/addon-themes',
    '@storybook/addon-vitest',
  ],
  docs: { autodocs: 'tag' },
};
export default config;