# Filament Resource Hooks Documentation

This document describes the frontend hooks and components scaffolded for managing Filament resource visibility with admin-only access controls.

## Overview

The Filament resource system provides role-based access control for admin panel resources, primarily focused on admin-only visibility. This implementation includes:

- **Hook**: `useFilamentResources` - Core hook for resource access management
- **Components**: `FilamentResourceGuard` and `AdminSectionGuard` - UI protection components  
- **Utilities**: `FilamentResourceUtils` - Helper functions for resource management

## Installation & Usage

### Import the hooks and components:

```typescript
import { 
  useFilamentResources, 
  FilamentResourceGuard, 
  AdminSectionGuard,
  FilamentResourceType 
} from '@/lib'
```

### Core Hook: `useFilamentResources()`

```typescript
const {
  // User info
  user,
  isAdmin,
  
  // Resource access checks  
  canAccessResource,
  hasAdminAccess,
  showAdminSection,
  
  // Resource lists
  accessibleResources,
  adminOnlyResources,
  
  // Utilities
  getResourceConfig,
  getAccessibleNavigation
} = useFilamentResources()
```

### Resource Types

The following Filament resource types are supported (all admin-only by default):

- `users` - User management and profiles
- `roles` - Role and permission management  
- `permissions` - System permissions configuration
- `settings` - System settings and configuration
- `admin-logs` - System and admin activity logs
- `system-health` - System health monitoring and diagnostics
- `cache-management` - Application cache management
- `backup-management` - Database and file backup management
- `file-manager` - System file management and uploads
- `email-templates` - Email template management
- `notifications` - System notification management

### Component Guards

#### FilamentResourceGuard

Protects content based on specific resource access:

```tsx
<FilamentResourceGuard 
  resourceType="users"
  fallback={<div>Access denied</div>}
  loadingComponent={<div>Loading...</div>}
>
  <UserManagementPanel />
</FilamentResourceGuard>
```

#### AdminSectionGuard

Protects entire admin sections:

```tsx
<AdminSectionGuard fallback={null}>
  <AdminNavigation />
</AdminSectionGuard>
```

### Navigation Filtering

Filter navigation items based on user permissions:

```typescript
const navigationItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Users', href: '/admin/users', resourceType: 'users' },
  { label: 'Settings', href: '/admin/settings', adminOnly: true }
]

const filteredNav = getAccessibleNavigation(navigationItems)
```

### Resource Access Checks

Check access programmatically:

```typescript
// Check specific resource access
const canManageUsers = canAccessResource('users')
const canViewLogs = canAccessResource('admin-logs')

// Check admin status
if (isAdmin) {
  // Show admin features
}

// Check if user should see admin sections
if (showAdminSection) {
  // Render admin navigation
}
```

## Implementation Details

### Security Model

- **Admin-Only by Default**: All Filament resources are restricted to admin users
- **Role-Based**: Uses existing role system from `useRole()` hook
- **Extensible**: Configuration supports multiple roles per resource
- **Fail-Safe**: Defaults to denying access when user is not authenticated

### Configuration

Resources are configured in `FILAMENT_RESOURCE_CONFIG`:

```typescript
const FILAMENT_RESOURCE_CONFIG = {
  users: {
    requiredRoles: ['admin'],
    adminOnly: true,
    description: 'User management and profiles'
  },
  // ... other resources
}
```

### Integration with Existing Auth

The hooks integrate seamlessly with the existing authentication system:

```typescript
// Uses existing auth context
const { user, hasRole, isAdmin } = useRole()

// Leverages existing role checking
const hasAccess = config.requiredRoles.some(role => hasRole(role))
```

## Testing

### Unit Tests

Tests are provided in `src/lib/hooks/__tests__/useFilamentResources.test.ts`:

- Admin user access scenarios
- Non-admin user restrictions  
- Unauthenticated user handling
- Navigation filtering
- Utility functions

### Example Component

See `src/components/examples/AdminDashboardExample.tsx` for a complete implementation example showing:

- Resource access status display
- Filtered navigation rendering
- Guard component usage
- Access check demonstrations

## Status

✅ **Complete**: Filament resource hooks scaffolded and tested  
✅ **TypeScript**: Full type safety with proper interfaces  
✅ **Integration**: Works with existing auth system  
✅ **Extensible**: Easy to add new resources and roles  
✅ **Tested**: Unit tests cover main use cases  

The implementation unblocks Windsurf UI checks by providing the necessary frontend infrastructure for Filament admin panel integration.