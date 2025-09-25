import type { Meta, StoryObj } from '@storybook/react';
import { viewports } from './Viewport.preset';

// Create a role-aware SideNav component for Storybook
const SideNav = ({ role = 'manager' }: { role?: string }) => {
  // Mock navigation items based on role
  const getNavItems = (role: string) => {
    switch (role) {
      case 'admin':
        return ['Dashboard', 'Projects', 'Tasks', 'Team', 'Settings'];
      case 'manager':
        return ['Dashboard', 'Projects', 'Tasks', 'Team'];
      case 'contributor':
        return ['Dashboard', 'Projects', 'Tasks'];
      case 'viewer':
        return ['Dashboard', 'Projects'];
      default:
        return ['Dashboard'];
    }
  };

  const navItems = getNavItems(role);

  return (
    <nav className="w-64 bg-card border-r p-4">
      <div className="mb-4 text-xs text-muted-foreground uppercase tracking-wide">
        Role: {role}
      </div>
      <ul className="space-y-2">
        {navItems.map((item, index) => (
          <li key={item}>
            <a 
              href="#" 
              className={`block px-3 py-2 rounded-md transition-colors ${
                index === 0 
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Mock TopBar component
const TopBar = ({ role }: { role?: string }) => (
  <div className="bg-card border-b px-6 py-4 flex items-center justify-between">
    <h1 className="text-xl font-semibold">Rehome Platform</h1>
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">
        Welcome, User ({role ?? 'manager'})
      </span>
      <div className="w-8 h-8 bg-primary rounded-full" />
    </div>
  </div>
);

// Layout Shell component
const LayoutShell = () => {
  const currentRole = (window as any).__STORYBOOK_ROLE__ ?? 'manager';
  
  return (
    <div className="min-h-[60vh] grid grid-cols-[260px_1fr]">
      <aside className="border-r">
        <SideNav role={currentRole} />
      </aside>
      <main>
        <TopBar role={currentRole} />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Content area (role-aware nav)</h2>
          <p className="text-muted-foreground mb-6">
            This layout demonstrates role-based navigation. Use the Role toolbar to switch between different user roles
            and see how the navigation changes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-medium">Card 1</h3>
              <p className="text-sm text-muted-foreground">Sample content</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-medium">Card 2</h3>
              <p className="text-sm text-muted-foreground">Sample content</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-medium">Card 3</h3>
              <p className="text-sm text-muted-foreground">Sample content</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const meta: Meta = {
  title: 'Layout/App',
  component: LayoutShell,
  parameters: {
    viewport: { viewports, defaultViewport: 'desktop' },
  },
};
export default meta;
type Story = StoryObj<typeof LayoutShell>;

export const Shell: Story = {
  render: () => <LayoutShell />,
};

export const TopBarOnly: Story = {
  render: () => {
    const currentRole = (window as any).__STORYBOOK_ROLE__ ?? 'manager';
    return <TopBar role={currentRole} />;
  },
};

export const SideNavOnly: Story = {
  render: () => {
    const currentRole = (window as any).__STORYBOOK_ROLE__ ?? 'manager';
    return <SideNav role={currentRole} />;
  },
};
