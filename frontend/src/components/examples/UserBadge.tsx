import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TEAM_TYPE_LABELS } from "@/lib/roles";

interface User {
  id: number;
  name: string;
  role: string;
  team_type?: string | null;
}

interface UserBadgeProps {
  user: User;
}

export const UserBadge: React.FC<UserBadgeProps> = ({ user }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="font-medium">{user.name}</span>
      
      {/* Role badge */}
      <Badge variant="secondary">{user.role}</Badge>
      
      {/* Team type badge (display-only, no gating logic) */}
      {user?.team_type ? (
        <Badge variant="outline">
          {TEAM_TYPE_LABELS[user.team_type] ?? user.team_type}
        </Badge>
      ) : null}
    </div>
  );
};

// Alternative simplified version as requested in task
export function UserBadge2({ user }: { user: User }) {
  const label = user.team_type
    ? TEAM_TYPE_LABELS[user.team_type] ?? user.team_type
    : user.role;

  return <Badge variant="secondary">{label}</Badge>;
}

// Important: SPA never gates actions by labels - only uses them for display
// Authorization logic should always be handled by backend/API endpoints