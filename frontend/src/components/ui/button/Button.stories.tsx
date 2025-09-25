import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  args: { children: 'Click me' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link']
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon']
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: 'outline' }
};

export const Destructive: Story = {
  args: { variant: 'destructive' }
};

export const Large: Story = {
  args: { size: 'lg' }
};

export const Small: Story = {
  args: { size: 'sm' }
};

export const Ghost: Story = {
  args: { variant: 'ghost' }
};

export const Link: Story = {
  args: { variant: 'link' }
};
