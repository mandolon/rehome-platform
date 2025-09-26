import type { Role } from '@/lib/types';

export type UserLike = {
  id?: string;
  name?: string;
  email?: string;
  role?: Role | string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export function makeUser(overrides: UserLike = {}) {
  const now = new Date().toISOString();
  const role = String(overrides.role ?? 'client').toLowerCase();
  return {
    id: overrides.id ?? 'u_test',
    name: overrides.name ?? 'Test User',
    email: overrides.email ?? 'test@example.com',
    role: (['admin','team','consultant','client'].includes(role) ? role : 'client') as Role,
    created_at: overrides.created_at ?? now,
    updated_at: overrides.updated_at ?? now,
    ...overrides,
  };
}