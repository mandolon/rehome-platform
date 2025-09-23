import React, { useState } from 'react';
import { Button, Input, Select, Table, Modal, Form, FormGroup } from '@/components';
import { TableColumn } from '@/types';

interface DemoData {
  id: string;
  name: string;
  role: string;
  status: string;
  email: string;
}

export const ComponentDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  // Demo data for table
  const demoData: DemoData[] = [
    { id: '1', name: 'John Doe', role: 'Project Manager', status: 'Active', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', role: 'Architect', status: 'Active', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', role: 'Contractor', status: 'Inactive', email: 'bob@example.com' },
  ];

  // Table columns configuration
  const columns: TableColumn<DemoData>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
    },
    {
      key: 'role',
      title: 'Role',
      sortable: true,
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: unknown) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {String(value)}
        </span>
      ),
    },
  ];

  const roleOptions = [
    { value: '', label: 'Select a role...' },
    { value: 'admin', label: 'Admin' },
    { value: 'project_manager', label: 'Project Manager' },
    { value: 'architect', label: 'Architect' },
    { value: 'contractor', label: 'Contractor' },
    { value: 'client', label: 'Client' },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Component Demo</h2>
        <p className="text-gray-600">
          This page demonstrates all the reusable components built for the Rehome Platform.
        </p>
      </div>

      {/* Buttons */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button loading>Loading Button</Button>
          <Button size="sm">Small Button</Button>
          <Button size="lg">Large Button</Button>
        </div>
      </div>

      {/* Form Inputs */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name"
            placeholder="Enter your name"
            helperText="This field is required"
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            leftIcon={<span>@</span>}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
          />
          <Select
            label="Role"
            options={roleOptions}
            placeholder="Select a role..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Data Table</h3>
          <Button onClick={() => setIsModalOpen(true)}>Add New User</Button>
        </div>
        <Table
          data={demoData}
          columns={columns}
          rowSelection={{
            selectedRowKeys: selectedRows,
            onChange: setSelectedRows,
          }}
        />
        {selectedRows.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              {selectedRows.length} row(s) selected
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        title="Add New User"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="user-form">
              Save User
            </Button>
          </>
        }
      >
        <Form
          id="user-form"
          onSubmit={handleFormSubmit}
          title="User Information"
          description="Fill in the details for the new user"
        >
          <FormGroup>
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
              required
            />
            <Select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={roleOptions}
              placeholder="Select a role..."
              required
            />
          </FormGroup>
        </Form>
      </Modal>

      {/* Role-Based Content Demo */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role-Based Features</h3>
        <p className="text-gray-600 mb-4">
          This platform supports role-based access control with the following roles:
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li><strong>Admin:</strong> Full system access, user management, system settings</li>
          <li><strong>Project Manager:</strong> Project oversight, team management, reports</li>
          <li><strong>Architect:</strong> Design access, project collaboration</li>
          <li><strong>Contractor:</strong> Task management, project updates</li>
          <li><strong>Client:</strong> Project status viewing, limited access</li>
        </ul>
      </div>
    </div>
  );
};