# Contributing to Rehome Platform

Thank you for your interest in contributing to the Rehome Platform! This guide outlines our development workflow and project structure.

## Project Layout

The Rehome Platform is organized as a monorepo with two main components:

- **`/backend`** - Laravel 11 API server with PostgreSQL database
- **`/frontend`** - Next.js 14 React application with TypeScript

## Development Workflow

### Getting Started

1. **Fork and clone** the repository
2. **Create a feature branch** following our naming conventions (see below)
3. **Make your changes** with appropriate tests
4. **Open a pull request** against the `main` branch

### Branch Naming Convention

Use one of these prefixes for your branch names:

- `feat/` - New features (e.g., `feat/user-authentication`)
- `fix/` - Bug fixes (e.g., `fix/login-validation-error`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Pull Request Requirements

All pull requests must pass the following checks before being merged:

- **Backend**: All tests must pass (`php artisan test`)
- **Frontend**: Code must pass linting (`pnpm lint`), type checking (`pnpm typecheck`), and tests (`pnpm test`)
- **Code review**: At least one approval from a maintainer
- **Documentation**: Update relevant documentation if your changes affect user-facing features or APIs

### Branch Protection

- **No direct commits** to the `main` branch
- All changes must go through pull requests
- Pull requests must pass CI checks before merging
- Pull requests require maintainer approval

## Development Setup

### Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan test
```

### Frontend (Next.js)
```bash
cd frontend
corepack enable
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
```

## Code Style

- **Backend**: Follow PSR-12 coding standards
- **Frontend**: Use Prettier and ESLint (configured in the project)
- **Commit messages**: Use clear, descriptive commit messages

## Questions?

If you have questions about contributing, please:

1. Check existing issues and discussions
2. Open a new issue for bugs or feature requests
3. Start a discussion for general questions

Thank you for contributing to Rehome Platform! 🏠