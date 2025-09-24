# Changelog

All notable changes to the Rehome Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- CodeRabbit AI automated code reviews with Sanctum SPA security prompts
- GitHub Actions CI/CD pipeline with backend/frontend testing
- Comprehensive authentication flow with Laravel Sanctum SPA
- Auto-labeling workflow for security-sensitive PRs
- Production deployment checklist and hardening guide

### Changed
- Updated PR template to include security and auth surface review
- Enhanced CONTRIBUTING.md with detailed CI/CD requirements

### Security
- Implemented CSRF protection with automatic token management
- Added security audits for backend and frontend dependencies
- Configured CORS for production-ready cross-origin requests

## [1.0.0] - 2025-09-23

### Added
- Initial project structure with Laravel 11 backend and Next.js 14 frontend
- User authentication system with role-based access control
- Project and task management features
- Database migrations and seeders for development
- Comprehensive test suites for both backend and frontend

### Security
- Laravel Sanctum SPA authentication implementation
- Session-based authentication with CSRF protection
- Role-based authorization policies

---

## How to Update This Changelog

When creating a PR, add your changes under the `[Unreleased]` section in the appropriate category:

- **Added** for new features
- **Changed** for changes in existing functionality  
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes and security improvements

### Example Entry Format:
```markdown
### Added
- New user dashboard with project overview (#123)
- Email notifications for task assignments (#124)

### Fixed  
- Login redirect loop on session expiration (#125)
- CORS headers missing on preflight requests (#126)
```

### Release Process:
1. Move `[Unreleased]` changes to a new version section
2. Update version numbers in `package.json` and `composer.json`
3. Create a git tag: `git tag -a v1.1.0 -m "Release v1.1.0"`
4. Push tags: `git push origin --tags`
