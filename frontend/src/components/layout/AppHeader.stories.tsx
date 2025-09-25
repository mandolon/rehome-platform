import type { Meta, StoryObj } from '@storybook/react';
import { AppHeader } from './AppHeader';

const meta: Meta<typeof AppHeader> = {
  title: 'Layout/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AppHeader>;

export const Default: Story = {};

export const WithSearch: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
