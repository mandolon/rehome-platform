# Branch Protection Settings

This document outlines the exact GitHub repository settings for branch protection on the `main` branch of the Rehome Platform repository.

## Required GitHub Settings

### General Settings

Navigate to: **Settings** → **Branches** → **Add rule** (or edit existing rule for `main`)

#### Branch Name Pattern
```
main
```

#### Protection Rules

**✅ Require a pull request before merging**
- ✅ Require approvals: **1**
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from CODEOWNERS

**✅ Require status checks to pass before merging**
- ✅ Require branches to be up to date before merging

**Required Status Checks:**
- `backend` (CI workflow job)
- `frontend` (CI workflow job)

**✅ Restrict pushes that create files**
- ✅ Block force pushes

**✅ Do not allow bypassing the above settings**
- ✅ Include administrators

## Status Check Details

The following status checks must pass before any pull request can be merged:

### Backend Status Check (`backend`)
- **Job**: Laravel backend tests and validation
- **Requirements**: 
  - PHP 8.2 compatibility
  - Composer dependency installation
  - Laravel test suite passes (`php artisan test`)

### Frontend Status Check (`frontend`)
- **Job**: Next.js frontend validation
- **Requirements**:
  - Node.js 18 compatibility
  - PNPM dependency installation
  - ESLint passes (`pnpm lint`)
  - TypeScript type checking passes (`pnpm typecheck`)
  - Jest test suite passes (`pnpm test`)

## CODEOWNERS Review

The repository uses a CODEOWNERS file (`.github/CODEOWNERS`) that requires review from designated code owners:

```
# Global ownership - all files assigned to @mandolon
* @mandolon
```

All pull requests will automatically request review from the specified code owners.

## Maintainer Checklist

Use this checklist when reviewing and configuring branch protection:

### Initial Setup
- [ ] Navigate to repository **Settings** → **Branches**
- [ ] Add or edit branch protection rule for `main`
- [ ] Verify branch name pattern is set to `main`

### Pull Request Requirements
- [ ] Enable "Require a pull request before merging"
- [ ] Set required approvals to **1**
- [ ] Enable "Dismiss stale pull request approvals when new commits are pushed"
- [ ] Enable "Require review from CODEOWNERS"

### Status Checks Configuration
- [ ] Enable "Require status checks to pass before merging"
- [ ] Enable "Require branches to be up to date before merging"
- [ ] Add required status check: `backend`
- [ ] Add required status check: `frontend`
- [ ] Verify status checks appear in the list after first CI run

### Security Settings
- [ ] Enable "Restrict pushes that create files"
- [ ] Enable "Block force pushes"
- [ ] Enable "Do not allow bypassing the above settings"
- [ ] Enable "Include administrators" (recommended)

### Verification Steps
- [ ] Test with a sample pull request to ensure all checks are enforced
- [ ] Verify CODEOWNERS review is automatically requested
- [ ] Confirm status checks must pass before merge option appears
- [ ] Test that force pushes are blocked
- [ ] Verify stale reviews are dismissed when new commits are pushed

### Maintenance
- [ ] Review branch protection settings quarterly
- [ ] Update required status checks when CI jobs change
- [ ] Update CODEOWNERS file when team structure changes
- [ ] Document any temporary bypass procedures for emergencies

## Troubleshooting

### Status Checks Not Appearing
- Status checks only appear after they have run at least once
- Ensure the CI workflow (`ci.yml`) job names match the required status check names
- Check that the workflow triggers on pull requests to the `main` branch

### CODEOWNERS Not Working
- Verify the `.github/CODEOWNERS` file exists and is properly formatted
- Ensure usernames in CODEOWNERS are valid GitHub usernames
- Check that "Require review from CODEOWNERS" is enabled in branch protection settings

### Emergency Access
In case of critical issues requiring immediate main branch access:
1. Contact repository administrator (@mandolon)
2. Temporarily disable branch protection if necessary
3. Make required changes via emergency pull request
4. Re-enable branch protection immediately after resolution
5. Document the incident and review protection settings

---

**Last Updated**: Generated automatically - keep this document in sync with actual repository settings.