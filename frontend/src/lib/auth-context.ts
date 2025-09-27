// Production auth context - delegates to AuthProvider
import { useAuth } from './auth/AuthProvider';

export function useRole() {
  const { user } = useAuth();
  return user?.role || 'guest';
}

export function useIsAdmin() {
  return useRole() === 'admin';
}

export function useIsAppUser() {
  const role = useRole();
  return role === 'team' || role === 'consultant' || role === 'client';
}