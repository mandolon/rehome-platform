# Rehome Platform

## Vision Statement

Rehome is the all-in-one operating system for residential construction, connecting the full journey from design to permits to build. It gives clients a clear portal to track progress and share documents, provides teams with real-time tools to draft, review, and manage work, and offers consultants a focused space to comment and collaborate. Built on a unified backend (Laravel) and frontend (Next.js), Rehome combines smooth UX with automated AI support for tasks, tests, and CI. The result is a single, responsive platform where homeowners, architects, engineers, and planners can work together seamlessly — reducing friction, cutting delays, and making construction simple.

Multi-role collaborative platform for architecture and construction teams. Features project management, task tracking, team collaboration, and client portals with real-time updates.

## Authorization (Simple Model)

**Principle:** Everyone can **read, write, edit, comment, upload**.  
**Roles only decide _where_ you act**, not _what_ you can do.

- **Roles:** `admin | manager | contributor | viewer`
- **Areas:**
  - `admin` → Admin (Filament) at `/admin/*`
  - `manager / contributor / viewer` → SPA at `/app/*` (API under `/api/app/*`)

**Effective rule =** (Role allows area) **AND** (User is a member of the workspace/project).

We **do not** use request-level roles (Manager/Contributor/Viewer/Creator) or per-action matrices.

### Rollout Plan (Safe)

1. **Feature flag:** `backend/.env` → `SIMPLE_RBAC=false` (default OFF).
2. **Add guarded code (no behavior change when flag is OFF):**
   - `EnsureRole` middleware (role check)
   - `ScopeWorkspace` middleware (resolve & verify membership, bind `currentWorkspace`)
   - `BaseScopedPolicy` (CRUD allowed if in workspace; `admin` bypass)
3. **Routes:**
   - `/admin/*` → `auth` + `role:admin`
   - `/api/app/*` → `auth:sanctum` + `role:manager,contributor,viewer` + `scope.workspace`
4. **Tests (add, don't remove yet):**
   - `AreaAccessTest`: admin allowed to `/admin/*`, others 403
   - `WorkspaceScopeTest`: member can CRUD under `/api/app/*`, non-member 403
5. **Staging:** flip `SIMPLE_RBAC=true`, smoke test.
6. **Cleanup (second PR):** remove old request-level policies/tests.

### Files Touched (monorepo-safe paths)

- `backend/app/Http/Middleware/EnsureRole.php`
- `backend/app/Http/Middleware/ScopeWorkspace.php`
- `backend/app/Policies/BaseScopedPolicy.php`
- `backend/bootstrap/app.php` (middleware aliases)
- `backend/routes/api.php`
- `backend/tests/Feature/AreaAccessTest.php`
- `backend/tests/Feature/WorkspaceScopeTest.php`

### Commands

```bash
git checkout -b chore/simpler-rbac-safe-migrate
git push -u origin chore/simpler-rbac-safe-migrate

# add flag (monorepo: backend/.env)
echo "SIMPLE_RBAC=false" >> backend/.env

# install & run tests (flag off, no changes expected)
cd backend
php composer.phar install --no-interaction --prefer-dist
php artisan test
```

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

## Roadmap to Final Output

### 1. **Skeleton Hierarchy (Admin-first)**
- Define Roles (admin, team, consultant, client)
- Entities: User, Workspace, Project, Task, Comment, Attachment, Activity
- Relations + Stamps

### 2. **Backend Setup (Cursor)**
- Migrations + Models with relations
- Policies (admin full CRUD)
- Filament Resources (User, Workspace, Project, Task, with RelationManagers)
- Seed demo data (1 workspace, 1 project, 2 tasks, etc.)
- Gate B (backend-ci) must pass

### 3. **Frontend/SPA (VS AI & Windsurf)**
- SPA for non-admin roles (team/consultant/client)
- Admin panel styling + Storybook components
- Task Board UI (group by status/project/assignee/date)
- Project page tabs: Files, Tasks, Meta
- Gate F (frontend-ci + Storybook) must pass

### 4. **Diagnostics (Junie)**
- Read-only mirroring of Gate B/F logs into `public-artifacts/`
- Config inspections (package.json, Storybook, Vitest, workflows)
- No code edits; diagnostics only

### 5. **CI Gates Discipline**
- Gate B: backend-ci (green required)
- Gate F: frontend-ci (green required)
- Junie: non-gating, diagnostics only

### 6. **Final Output Definition**
- Admin panel (Filament) fully functional with Projects/Tasks/Comments/Attachments/Activity
- SPA roles routed correctly
- Storybook build (v8.6.14) verified
- Tests (Laravel + Vitest) green in CI
- Roadmap milestones all checked off
