# Rehome Platform

Multi-role collaborative platform for architecture and construction teams. Features project management, task tracking, team collaboration, and client portals with real-time updates.

## Tech Stack
- **Backend**: Laravel 11 + PostgreSQL
- **Frontend**: Next.js 14 + React
- **Authentication**: Laravel Sanctum
- **Real-time**: Laravel Broadcasting
- **UI**: Tailwind CSS + shadcn/ui
- **CI/CD**: GitHub Actions

## 🤖 Gates & Agents

This repository uses a **multi-agent development approach** with specialized AI agents and automated gates:

### Development Agents
- **Cursor**: Backend development (Laravel, PHP, database)
- **VS AI**: Frontend development (Next.js, React, TypeScript)
- **Windsurf**: Cross-cutting concerns and frontend features
- **Junie (PhpStorm)**: Diagnostics only - provides read-only analysis and config inspection

### Automated Gates
- **Gate B (backend-ci)**: Runs on backend changes, managed by Cursor
- **Gate F (frontend-ci)**: Runs on frontend changes, includes Storybook build on UI changes

### Global Guardrails
- **G2 Tripwire**: `git status --porcelain=v1` (warn-only) - alerts to uncommitted changes
- **G3 Ownership**: Agents respect file/workflow ownership boundaries
- **Junie Constraints**: Read-only role - cannot edit code, only provides diagnostics

### Running Junie Diagnostics

Junie provides diagnostic information through the Storm Guard system:

## Project Structure


## Windows: Run Storm Guard

**Junie Diagnostics**: Use Storm Guard to generate diagnostic reports and public artifacts.

### Read-Only Diagnostics (Default)

1) From repo root (uses Windows PowerShell, not pwsh):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Storm-Guard.ps1
```

2) Already inside a Windows PowerShell window? Run it directly:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\Storm-Guard.ps1
```

### Write-Enabled Mode (One-Run)

For diagnostic runs that need to generate public artifacts:

```powershell
# Via VS Code Task: "Storm: Enable Writes (One-Run)"
# Or manually:
$env:STORM_ALLOW_WRITE="1"; .\scripts\Storm-Guard.ps1
```

### Diagnostic Outputs

- **Console**: Real-time diagnostic information
- **Public Artifacts**: `frontend/gatef_artifacts_public/` (when write-enabled)
- **Local Debug**: `frontend/.gatef_artifacts/` (debugging only, not needed for normal use)

If execution is blocked:

```powershell
Unblock-File .\scripts\Storm-Guard.ps1
.\scripts\Storm-Guard.ps1
```

**Notes:**
- Junie provides diagnostics only - cannot modify code or configurations
- The dirty git tree warning is expected (storybook artifacts, etc.) and will warn but continue
- In VS Code, use Tasks: "Storm: Proof (Read-Only)" or "Storm: Enable Writes (One-Run)"
- For PowerShell 7: `winget install --id Microsoft.PowerShell -e`
