import type { Meta, StoryObj } from '@storybook/react';
import { DataTable, type Column } from './DataTable';
import { Badge } from './badge';

const sampleData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'inactive',
    role: 'user',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'pending',
    role: 'moderator',
  },
];

const columns: Column<typeof sampleData[0]>[] = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <Badge variant={value === 'active' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    ),
  },
  {
    key: 'role',
    label: 'Role',
    render: (value) => (
      <Badge variant="outline">{value}</Badge>
    ),
  },
];

const meta: Meta<typeof DataTable> = {
  title: 'UI/DataTable',
  component: DataTable,
  args: {
    data: sampleData,
    columns,
    searchable: true,
    filterable: true,
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {};

export const WithoutSearch: Story = {
  args: {
    searchable: false,
    filterable: false,
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};
