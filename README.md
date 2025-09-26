# Rehome Platform
  [![Backend CI](https://github.com/<ORG_OR_USER>/rehome-platform/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/<ORG_OR_USER>/rehome-platform/actions/workflows/backend-ci.yml)
  [![Frontend CI](https://github.com/mandolon/rehome-platform/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/mandolon/rehome-platform/actions/workflows/frontend-ci.yml)
  
  Multi-role collaborative platform for architecture and construction teams. Features project management, task tracking, team collaboration, and client portals with real-time updates.

## Tech Stack
- **Backend**: Laravel 11 + PostgreSQL
- **UI**: Tailwind CSS + shadcn/ui
- **CI/CD**: GitHub Actions

  ## Project Structure

## DIY Local CI
- VS Code: Run Task "DIY: Verify All" (Ctrl/Cmd+Shift+B).
- CLI: `scripts/verify-all.sh` (macOS/Linux) or `scripts/verify-all.ps1` (Windows).
- Optional: `git config core.hooksPath .githooks` to run backend tests before every commit.

## Devbox Reset (Windows, nvm-windows)

If Node/pnpm/Corepack get tangled (PATH issues, `pnpm : not recognized`, `ERR_INVALID_THIS`, etc.), run our reset script:

```powershell
# From repo root
pwsh -NoProfile -ExecutionPolicy Bypass -File .\scripts\Reset-NodePnpm.ps1
```