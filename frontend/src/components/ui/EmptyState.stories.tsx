import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { FileText, Users, Settings } from 'lucide-react';

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: 'No requests found',
    description: 'Get started by creating your first request.',
    action: {
      label: 'Create Request',
      onClick: () => console.log('Create request clicked'),
    },
  },
};

export const WithIcon: Story = {
  args: {
    icon: <FileText className="h-12 w-12" />,
    title: 'No files uploaded',
    description: 'Upload your first file to get started.',
    action: {
      label: 'Upload File',
      onClick: () => console.log('Upload file clicked'),
    },
  },
};

export const WithoutAction: Story = {
  args: {
    icon: <Users className="h-12 w-12" />,
    title: 'No team members',
    description: 'Team members will appear here once they are added.',
  },
};

export const SettingsExample: Story = {
  args: {
    icon: <Settings className="h-12 w-12" />,
    title: 'Settings not configured',
    description: 'Configure your settings to get started.',
    action: {
      label: 'Configure',
      onClick: () => console.log('Configure clicked'),
    },
  },
};
