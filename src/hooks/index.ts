import { useContext } from 'react';
import { AuthContext, AuthContextType } from './authContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Re-export for convenience
export { AuthProvider } from './useAuth';
export type { AuthContextType } from './authContext';