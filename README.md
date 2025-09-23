# Rehome Platform - React Frontend

Collaborative project management platform for architecture and construction teams. Laravel backend with React frontend, featuring multi-role dashboards and real-time collaboration tools.

## Features

### Reusable Components
- **Buttons**: Multiple variants (primary, secondary, danger, outline) with loading states
- **Form Controls**: Input fields, select dropdowns with validation and error handling
- **Data Tables**: Sortable columns, row selection, pagination support
- **Modals**: Accessible modal dialogs with customizable sizes and actions
- **Navigation**: Responsive navigation with mobile menu support

### Authentication & Authorization
- **Role-Based Access Control**: Support for 5 user roles (admin, project_manager, architect, contractor, client)
- **Authentication Guards**: Protected routes with automatic redirects
- **Permission System**: Granular permissions based on user roles
- **Persistent Sessions**: LocalStorage-based session management

### Layout System
- **Role-Based Layouts**: Different layouts optimized for each user role
- **Admin Layout**: Full sidebar with system management options
- **Project Manager Layout**: Team and project oversight interface
- **Client Layout**: Simplified view for project status
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## User Roles

1. **Admin**: Full system access, user management, system settings
2. **Project Manager**: Project oversight, team management, reports
3. **Architect**: Design access, project collaboration
4. **Contractor**: Task management, project updates
5. **Client**: Project status viewing, limited access

## Technology Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **ESLint** for code quality

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd rehome-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Development Server
The development server runs on `http://localhost:3000`

### Demo Login
Use any email/password combination to access the demo. The system will automatically log you in as a Project Manager role.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Input, Select)
│   ├── forms/           # Form-related components
│   ├── tables/          # Data table components
│   ├── modals/          # Modal components
│   ├── navigation/      # Navigation components
│   └── demo/            # Component demonstration
├── layouts/             # Layout components for different roles
├── guards/              # Authentication and authorization guards
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Component Usage

### Button Component
```tsx
import { Button } from '@/components';

<Button variant="primary" size="lg" loading={isLoading}>
  Save Changes
</Button>
```

### Table Component
```tsx
import { Table } from '@/components';

const columns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
];

<Table data={users} columns={columns} />
```

### Modal Component
```tsx
import { Modal } from '@/components';

<Modal 
  title="Add User" 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
>
  <form>...</form>
</Modal>
```

## Authentication

The platform uses a context-based authentication system with the following hooks:

```tsx
import { useAuth } from '@/hooks';

const { user, login, logout, hasRole, hasPermission } = useAuth();

// Check user role
if (hasRole(['admin', 'project_manager'])) {
  // Show admin content
}

// Check specific permission
if (hasPermission('project:write')) {
  // Show edit button
}
```

## Protected Routes

Use the AuthGuard component to protect routes:

```tsx
import { AuthGuard } from '@/guards/AuthGuard';

<AuthGuard requiredRoles={['admin']}>
  <AdminPanel />
</AuthGuard>
```

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper type definitions
4. Test components thoroughly
5. Run linting before committing

## License

This project is proprietary software for architecture and construction project management.
