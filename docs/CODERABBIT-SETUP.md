# 🤖 CodeRabbit AI Setup Guide

This guide explains how to set up CodeRabbit AI for automated code reviews in the Rehome Platform repository.

## Quick Setup

### 1. Install CodeRabbit GitHub App

1. Go to the [CodeRabbit GitHub Marketplace](https://github.com/marketplace/coderabbit-ai)
2. Click **"Install it for free"**
3. Select your organization/account
4. Choose **"Selected repositories"** and select `rehome-platform`
5. Click **"Install & Authorize"**

### 2. Verify Configuration

The repository already includes:
- **Configuration**: `.coderabbit/config.yml` with backend/frontend rules
- **CI Workflow**: `.github/workflows/coderabbit.yml` for automated testing
- **Documentation**: Updated `CONTRIBUTING.md` with review process

### 3. Test the Setup

1. Create a test branch: `git checkout -b test/coderabbit-setup`
2. Make a small change to any file
3. Push and create a pull request
4. Verify that:
   - GitHub Actions run successfully
   - CodeRabbit bot comments on the PR with review feedback

## Configuration Details

### Backend Checks (Laravel)

CodeRabbit will automatically check:

```yaml
# Commands run for backend validation
- composer validate --strict
- composer install --no-interaction --prefer-dist --optimize-autoloader  
- php artisan test
- ./vendor/bin/pint --test (if available)
```

**What it reviews**:
- Laravel best practices and conventions
- Eloquent usage and N+1 query detection
- Security vulnerabilities (SQL injection, XSS)
- Composer dependency validation
- Test coverage and quality

### Frontend Checks (Next.js/React)

CodeRabbit will automatically check:

```yaml
# Commands run for frontend validation
- npm ci
- npm run lint
- npm run typecheck  
- npm run test
- npm run build (optional)
```

**What it reviews**:
- TypeScript type safety and strict checks
- React hooks and component best practices
- Accessibility (a11y) compliance
- Performance optimizations
- Security vulnerabilities in dependencies

## GitHub Actions Integration

The workflow `.github/workflows/coderabbit.yml` runs on every pull request:

### Jobs Overview

1. **Backend Tests** (`ubuntu-latest`)
   - Sets up PHP 8.2 with extensions
   - Configures MySQL 8.0 test database
   - Runs composer validation and tests
   - Checks code style with Laravel Pint

2. **Frontend Tests** (`ubuntu-latest`)
   - Sets up Node.js 18 with npm cache
   - Runs linting, type checking, and tests
   - Builds application for validation

3. **Security Scan**
   - Audits backend dependencies with `composer audit`
   - Audits frontend dependencies with `npm audit`
   - Checks for high-severity vulnerabilities

4. **Code Quality**
   - Detects large files (>10MB)
   - Scans for potential secrets in code
   - Checks file permissions

5. **Notify CodeRabbit**
   - Posts CI results as PR comment
   - Indicates readiness for AI review

### Status Checks

All jobs must pass for the PR to be mergeable:
- ✅ Backend tests pass
- ✅ Frontend tests pass  
- ✅ Security scans clean
- ✅ Code quality checks pass
- ✅ CodeRabbit AI review completed

## Customizing Reviews

### Path-Based Rules

CodeRabbit applies different rules based on file paths:

```yaml
# Backend-specific paths
backend:
  paths:
    - "backend/**/*.php"
    - "backend/composer.json"
    - "backend/composer.lock"

# Frontend-specific paths  
frontend:
  paths:
    - "frontend/**/*.ts"
    - "frontend/**/*.tsx"
    - "frontend/**/*.js"
    - "frontend/**/*.jsx"
    - "frontend/package.json"
```

### Custom Prompts

Special review prompts for specific scenarios:

- **Laravel Migrations**: Checks rollback methods, foreign keys, indexes
- **React Components**: Verifies best practices, prop types, accessibility
- **API Endpoints**: Reviews authentication, validation, error handling

### Ignore Patterns

CodeRabbit ignores:
- Build artifacts (`dist/`, `build/`, `.next/`)
- Dependencies (`node_modules/`, `vendor/`)
- Generated files (`coverage/`, `storage/logs/`)
- Environment files (`.env*`)

## Troubleshooting

### CodeRabbit Not Commenting

1. **Check App Installation**: Ensure CodeRabbit app is installed for your repository
2. **Verify Permissions**: CodeRabbit needs read/write access to pull requests
3. **Check Configuration**: Validate `.coderabbit/config.yml` syntax
4. **Review Logs**: Check GitHub Actions logs for errors

### CI Failing

1. **Backend Issues**:
   - Check PHP version compatibility (requires 8.2+)
   - Verify database connection in tests
   - Ensure all dependencies are in `composer.json`

2. **Frontend Issues**:
   - Check Node.js version (requires 18+)
   - Verify all npm scripts exist (`lint`, `typecheck`, `test`)
   - Ensure TypeScript configuration is valid

### Common Fixes

```bash
# Fix backend dependency issues
cd backend
composer install --no-interaction
composer validate --strict

# Fix frontend dependency issues  
cd frontend
npm ci
npm run lint -- --fix
npm run typecheck
```

## Best Practices

### For Contributors

1. **Run checks locally** before pushing:
   ```bash
   # Backend
   cd backend && composer test && php artisan test
   
   # Frontend  
   cd frontend && npm run lint && npm run typecheck && npm run test
   ```

2. **Address CodeRabbit feedback** promptly
3. **Keep PRs focused** - smaller changes get better reviews
4. **Write descriptive commit messages**

### For Maintainers

1. **Review CodeRabbit suggestions** before approving PRs
2. **Use CodeRabbit insights** to identify code patterns
3. **Update configuration** as project evolves
4. **Monitor CI performance** and optimize as needed

## Support

- **CodeRabbit Documentation**: [docs.coderabbit.ai](https://docs.coderabbit.ai)
- **GitHub Actions Help**: [docs.github.com/actions](https://docs.github.com/en/actions)
- **Project Issues**: Create an issue in this repository

---

**✅ Once CodeRabbit is installed, all future pull requests will receive automated AI code reviews!**
