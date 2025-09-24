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

- `feat/` - New features (e.g., `feat/user-authentication`)
- `fix/` - Bug fixes (e.g., `fix/login-validation-error`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Pull Request Requirements

All pull requests must pass the following checks before being merged:

- **Backend**: All tests must pass (`php artisan test`)
- **Frontend**: Code must pass linting (`npm run lint`), type checking (`npm run typecheck`), and tests (`npm run test`)
- **CodeRabbit AI Review**: Automated AI code review will analyze your changes
- **Code review**: At least one approval from a maintainer
- **Documentation**: Update relevant documentation if your changes affect user-facing features or APIs

### 🤖 CodeRabbit AI Reviews

This repository uses **CodeRabbit AI** for automated code reviews on all pull requests. CodeRabbit will:

- **Analyze code quality** and suggest improvements
- **Check for security vulnerabilities** and best practices
- **Review Laravel and React patterns** for adherence to conventions
- **Validate test coverage** and suggest additional tests
- **Check for performance issues** and optimization opportunities

**Setup Required**: The CodeRabbit GitHub App must be installed from the [GitHub Marketplace](https://github.com/marketplace/coderabbit-ai) for AI reviews to work.

#### What CodeRabbit Checks

**Backend (Laravel)**:
- Composer validation and dependency security
- Laravel best practices and conventions
- Eloquent usage and N+1 query detection
- Security vulnerabilities (SQL injection, XSS)
- Test coverage and quality

**Frontend (Next.js/React)**:
- TypeScript type safety and strict checks
- React hooks and component best practices
- Accessibility (a11y) compliance
- Performance optimizations
- Security vulnerabilities in dependencies

#### CI/CD Integration

Our GitHub Actions workflow (`.github/workflows/coderabbit.yml`) runs automatically on pull requests and includes:

- **Backend Tests**: `composer install` → `php artisan test`
- **Frontend Tests**: `npm ci` → `npm run lint` → `npm run typecheck` → `npm run test`  
- **Security Scans**: Dependency vulnerability checks
- **Code Quality**: Large file detection, secret scanning

All checks must pass before your PR can be merged.

### Branch Protection

- **No direct commits** to the `main` branch
- All changes must go through pull requests
- Pull requests must pass **ALL** required CI checks before merging

#### Required Status Checks

The following GitHub Actions checks must pass before merging:

**✅ Required Checks (must pass):**
- `Backend Tests` - Laravel test suite with MySQL database
- `Frontend Tests` - Next.js linting, type checking, and test suite
- `Security Scan` - Dependency vulnerability audits
- `Code Quality Checks` - File size, secrets, and permissions validation

**ℹ️ Informational Checks:**
- `Notify CodeRabbit` - Posts CI results summary to PR

**🤖 CodeRabbit AI Review:**
- Automated code review with security and best practice analysis
- Must complete successfully (no blocking issues flagged)

#### Specific Check Requirements

**Backend Tests (`backend-tests`):**
- ✅ `composer validate --strict` - Composer file validation
- ✅ `composer install` - Dependency installation
- ✅ `php artisan test` - Full Laravel test suite
- ⚠️ `./vendor/bin/pint --test` - Code style (optional)

**Frontend Tests (`frontend-tests`):**
- ✅ `npm ci` - Clean dependency installation
- ✅ `npm run lint` - ESLint code quality checks
- ✅ `npm run typecheck` - TypeScript compilation
- ✅ `npm run test` - Jest/Vitest test suite
- ⚠️ `npm run build` - Production build validation (optional)

**Security Scan (`security-scan`):**
- ✅ `composer audit` - Backend dependency vulnerabilities
- ✅ `npm audit --audit-level=high` - Frontend dependency vulnerabilities

All ✅ checks must pass for PR to be mergeable. ⚠️ checks are informational only.

For detailed branch protection configuration and maintainer setup instructions, see [Branch Protection Settings](docs/branch-protection.md).

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