import { useMemo } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import type { Role } from '@/lib/types';

type RoleInput = Role | string | Array<Role | string>;

function normalizeRole(input: unknown): Role {
  const v = String(input ?? '').toLowerCase();
  if (v === 'admin') return 'admin';
  if (v === 'team') return 'team';
  if (v === 'consultant') return 'consultant';
  if (v === 'client') return 'client';
  return 'client';
}

export function useRole() {
  const { user } = useAuth();

  const role: Role = useMemo(
    () => normalizeRole((user as any)?.role),
    [user]
  );

  function hasRole(input: RoleInput): boolean {
    const wants = (Array.isArray(input) ? input : [input]).map((w) =>
      normalizeRole(w)
    );
    return wants.includes(role);
  }

  function isAdmin(): boolean {
    return role === 'admin';
  }

  return { user, role, hasRole, isAdmin };
}

export default useRole;


