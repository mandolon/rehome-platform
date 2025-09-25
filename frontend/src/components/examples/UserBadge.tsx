// Example usage of team type labels in a React component
import React from 'react';
import { TEAM_TYPE_LABELS } from '@/lib/roles';

interface User {
  id: number;
  name: string;
  role: string;
  team_type?: string;
}

interface UserBadgeProps {
  user: User;
}

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
    {children}
  </span>
);

export const UserBadge: React.FC<UserBadgeProps> = ({ user }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="font-medium">{user.name}</span>
      
      {/* Role badge */}
      <Badge>{user.role}</Badge>
      
      {/* Team type badge (display-only, no gating logic) */}
      {user?.team_type ? (
        <Badge>
          {TEAM_TYPE_LABELS[user.team_type] ?? user.team_type}
        </Badge>
      ) : null}
    </div>
  );
};

// Important: SPA never gates actions by labels - only uses them for display
// Authorization logic should always be handled by backend/API endpoints