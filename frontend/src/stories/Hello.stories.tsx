import type { Meta, StoryObj } from '@storybook/react';

const Demo = () => <div className="p-6 text-base">Storybook is live ✅</div>;

const meta: Meta<typeof Demo> = { 
  title: 'Smoke/Hello', 
  component: Demo 
};

export default meta;
type Story = StoryObj<typeof Demo>;

export const Default: Story = {};
