import React from 'react';
import { Navigation, SidebarNavigation } from '@/components/navigation/Navigation';
import { NavigationItem, UserRole } from '@/types';
import { useAuth } from '@/hooks';

interface BaseLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarItems?: NavigationItem[];
}

// Base layout with common navigation items
const getBaseNavigationItems = (userRole: UserRole): NavigationItem[] => {
  const baseItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: '🏠',
    },
    {
      id: 'projects',
      label: 'Projects',
      path: '/projects',
      icon: '📋',
    },
    {
      id: 'demo',
      label: 'Components Demo',
      path: '/demo',
      icon: '🧩',
    },
  ];

  // Role-specific navigation items
  const roleSpecificItems: Record<UserRole, NavigationItem[]> = {
    admin: [
      {
        id: 'users',
        label: 'User Management',
        path: '/users',
        icon: '👥',
        requiredRoles: ['admin'],
      },
      {
        id: 'settings',
        label: 'System Settings',
        path: '/settings',
        icon: '⚙️',
        requiredRoles: ['admin'],
      },
    ],
    project_manager: [
      {
        id: 'team',
        label: 'Team Management',
        path: '/team',
        icon: '👥',
        requiredRoles: ['project_manager', 'admin'],
      },
      {
        id: 'reports',
        label: 'Reports',
        path: '/reports',
        icon: '📊',
        requiredRoles: ['project_manager', 'admin'],
      },
    ],
    architect: [
      {
        id: 'designs',
        label: 'Designs',
        path: '/designs',
        icon: '🎨',
        requiredRoles: ['architect', 'project_manager', 'admin'],
      },
    ],
    contractor: [
      {
        id: 'tasks',
        label: 'Tasks',
        path: '/tasks',
        icon: '📝',
        requiredRoles: ['contractor', 'project_manager', 'admin'],
      },
    ],
    client: [
      {
        id: 'status',
        label: 'Project Status',
        path: '/status',
        icon: '📈',
        requiredRoles: ['client', 'project_manager', 'admin'],
      },
    ],
  };

  return [...baseItems, ...roleSpecificItems[userRole]];
};

export const BaseLayout: React.FC<BaseLayoutProps> = ({ 
  children, 
  showSidebar = false,
  sidebarItems 
}) => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const navigationItems = getBaseNavigationItems(user.role);
  const sidebarNavigationItems = sidebarItems || navigationItems;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation items={navigationItems} />
      
      <div className="flex">
        {showSidebar && (
          <div className="hidden md:block">
            <SidebarNavigation items={sidebarNavigationItems} />
          </div>
        )}
        
        <main className={`flex-1 ${showSidebar ? 'md:ml-0' : ''}`}>
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Admin Layout - Full access with sidebar
export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const adminSidebarItems: NavigationItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      path: '/admin/overview',
      icon: '📊',
    },
    {
      id: 'users',
      label: 'Users',
      path: '/admin/users',
      icon: '👥',
      children: [
        { id: 'all-users', label: 'All Users', path: '/admin/users' },
        { id: 'roles', label: 'Roles & Permissions', path: '/admin/users/roles' },
      ],
    },
    {
      id: 'projects-admin',
      label: 'Projects',
      path: '/admin/projects',
      icon: '📋',
      children: [
        { id: 'all-projects', label: 'All Projects', path: '/admin/projects' },
        { id: 'templates', label: 'Project Templates', path: '/admin/projects/templates' },
      ],
    },
    {
      id: 'system',
      label: 'System',
      path: '/admin/system',
      icon: '⚙️',
      children: [
        { id: 'settings', label: 'Settings', path: '/admin/system/settings' },
        { id: 'logs', label: 'System Logs', path: '/admin/system/logs' },
      ],
    },
  ];

  return (
    <BaseLayout showSidebar={true} sidebarItems={adminSidebarItems}>
      {children}
    </BaseLayout>
  );
};

// Project Manager Layout
export const ProjectManagerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pmSidebarItems: NavigationItem[] = [
    {
      id: 'dashboard-pm',
      label: 'Dashboard',
      path: '/pm/dashboard',
      icon: '🏠',
    },
    {
      id: 'projects-pm',
      label: 'My Projects',
      path: '/pm/projects',
      icon: '📋',
    },
    {
      id: 'team-pm',
      label: 'Team',
      path: '/pm/team',
      icon: '👥',
    },
    {
      id: 'reports-pm',
      label: 'Reports',
      path: '/pm/reports',
      icon: '📊',
    },
  ];

  return (
    <BaseLayout showSidebar={true} sidebarItems={pmSidebarItems}>
      {children}
    </BaseLayout>
  );
};

// Client Layout - Simplified view
export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BaseLayout showSidebar={false}>
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </BaseLayout>
  );
};

// General Dashboard Layout
export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  // Route to appropriate layout based on role
  switch (user.role) {
    case 'admin':
      return <AdminLayout>{children}</AdminLayout>;
    case 'project_manager':
      return <ProjectManagerLayout>{children}</ProjectManagerLayout>;
    case 'client':
      return <ClientLayout>{children}</ClientLayout>;
    default:
      return <BaseLayout showSidebar={true}>{children}</BaseLayout>;
  }
};