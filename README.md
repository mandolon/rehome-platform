# Rehome Platform
  [![Backend CI](https://github.com/<ORG_OR_USER>/rehome-platform/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/<ORG_OR_USER>/rehome-platform/actions/workflows/backend-ci.yml)
  
  Multi-role collaborative platform for architecture and construction teams. Features project management, task tracking, team collaboration, and client portals with real-time updates.

## Tech Stack
- **Backend**: Laravel 11 + PostgreSQL
- **UI**: Tailwind CSS + shadcn/ui
- **CI/CD**: GitHub Actions

##  Automated Code Reviews

This repository uses **CodeRabbit AI** for automated code reviews on all pull requests.  **Setup Required**: Install the [CodeRabbit GitHub App](https://github.com/marketplace/coderabbit-ai) to enable AI reviews.
  
  See [`docs/CODERABBIT-SETUP.md`](docs/CODERABBIT-SETUP.md) for detailed setup instructions.
  
  ## Project Structure

  ## DIY Local CI
  - VS Code: Run Task "DIY: Verify All" (Ctrl/Cmd+Shift+B).
  - CLI: `scripts/verify-all.sh` (macOS/Linux) or `scripts/verify-all.ps1` (Windows).
  - Optional: `git config core.hooksPath .githooks` to run backend tests before every commit.
