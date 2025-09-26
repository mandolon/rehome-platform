import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from './AppSidebar';

const meta: Meta<typeof AppSidebar> = {
  title: 'Layout/AppSidebar',
  component: AppSidebar,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AppSidebar>;

export const Expanded: Story = {};

export const Collapsed: Story = {
  args: {
    // This would need to be controlled by state in real usage
  },
};
