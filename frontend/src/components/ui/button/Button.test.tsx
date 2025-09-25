import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    render(<Button variant="outline">Outline Button</Button>);
    expect(screen.getByText('Outline Button')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    render(<Button size="lg">Large Button</Button>);
    expect(screen.getByText('Large Button')).toBeInTheDocument();
  });
});
