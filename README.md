# Rehome Platform

Multi-role collaborative platform for architecture and construction teams. Features project management, task tracking, team collaboration, and client portals with real-time updates.

## Tech Stack
- **Backend**: Laravel 11 + PostgreSQL
- **Frontend**: Next.js 14 + React
- **Authentication**: Laravel Sanctum
- **Real-time**: Laravel Broadcasting
- **UI**: Tailwind CSS + shadcn/ui
- **Code Review**: CodeRabbit AI
- **CI/CD**: GitHub Actions

## 🤖 Automated Code Reviews

This repository uses **CodeRabbit AI** for automated code reviews on all pull requests. 

**Setup Required**: Install the [CodeRabbit GitHub App](https://github.com/marketplace/coderabbit-ai) to enable AI reviews.

See [`docs/CODERABBIT-SETUP.md`](docs/CODERABBIT-SETUP.md) for detailed setup instructions.

## Project Structure


## Windows: Run Storm Guard

Two quick ways to run our Storm Guard checks on Windows.

1) From repo root (uses Windows PowerShell, not pwsh):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Storm-Guard.ps1
```

2) Already inside a Windows PowerShell window? Run it directly:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\Storm-Guard.ps1
```

If execution is blocked:

```powershell
Unblock-File .\scripts\Storm-Guard.ps1
.\scripts\Storm-Guard.ps1
```

Notes:
- The dirty git tree warning is expected (storybook artifacts, etc.). The script will warn and continue for read-only proof runs.
- In VS Code, the Tasks "Storm: Proof (Read-Only)" and "Storm: Enable Writes (One-Run)" now use Windows PowerShell under the hood.
- If you really want PowerShell 7 later:

```powershell
winget install --id Microsoft.PowerShell -e
```
