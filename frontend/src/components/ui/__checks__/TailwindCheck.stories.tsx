import type { Meta, StoryObj } from '@storybook/react';
import TailwindCheck from './TailwindCheck';

const meta: Meta<typeof TailwindCheck> = { 
  title: 'Checks/Tailwind', 
  component: TailwindCheck 
};

export default meta;
export type Story = StoryObj<typeof TailwindCheck>;

export const Default: Story = {};