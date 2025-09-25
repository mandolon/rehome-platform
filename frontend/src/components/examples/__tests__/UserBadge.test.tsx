import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserBadge, UserBadge2 } from '../UserBadge';

describe('UserBadge Components', () => {
  const mockUser = {
    id: 1,
    name: 'Alice Architect',
    role: 'team',
    team_type: 'architect',
  };

  const mockUserWithoutTeamType = {
    id: 2,
    name: 'Bob Admin',
    role: 'admin',
    team_type: null,
  };

  describe('UserBadge (Full Component)', () => {
    it('renders user name and both role and team type badges', () => {
      render(<UserBadge user={mockUser} />);
      
      expect(screen.getByText('Alice Architect')).toBeInTheDocument();
      expect(screen.getByText('team')).toBeInTheDocument();
      expect(screen.getByText('Architect')).toBeInTheDocument();
    });

    it('renders only role badge when team_type is null', () => {
      render(<UserBadge user={mockUserWithoutTeamType} />);
      
      expect(screen.getByText('Bob Admin')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.queryByText('Architect')).not.toBeInTheDocument();
    });

    it('falls back to team_type value when label not found', () => {
      const userWithUnknownType = {
        ...mockUser,
        team_type: 'unknown_type',
      };

      render(<UserBadge user={userWithUnknownType} />);
      
      expect(screen.getByText('unknown_type')).toBeInTheDocument();
    });
  });

  describe('UserBadge2 (Simplified Version)', () => {
    it('shows team type label when team_type is present', () => {
      render(<UserBadge2 user={mockUser} />);
      
      expect(screen.getByText('Architect')).toBeInTheDocument();
    });

    it('shows role when team_type is null', () => {
      render(<UserBadge2 user={mockUserWithoutTeamType} />);
      
      expect(screen.getByText('admin')).toBeInTheDocument();
    });
  });
});