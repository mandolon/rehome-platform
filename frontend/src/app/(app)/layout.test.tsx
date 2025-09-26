import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AppLayout from './layout';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

describe('AppLayout', () => {
  it('renders without crashing', () => {
    render(
      <AppLayout>
        <div>Test content</div>
      </AppLayout>
    );
    
    expect(screen.getByText('ReHome')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
