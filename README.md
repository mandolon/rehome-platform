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

# Rehome Platform

Rehome is the all-in-one operating system for residential construction.  
It connects the full journey from **design → permits → build**, bringing together clients, teams, consultants, and admins in one place.

## Vision
- Give clients a clear portal to track progress, upload/share documents, and comment.
- Provide teams with real-time tools to draft, review, and manage work.
- Offer consultants a focused space to collaborate and comment.
- Equip admins with full control via a dedicated `/admin` area.

## Tech Stack
- **Backend**: Laravel 11 + PostgreSQL
- **Frontend**: Next.js 14 + React
- **Auth**: Workspace-based roles (Admin, Team, Consultant, Client)
- **CI/CD**: GitHub Actions (backend-ci, frontend-ci)
- **Storybook**: UI component library for frontend

## Roles & Access
Everyone can read, write, edit, upload, and comment.  
Authorization is based on **where** actions happen:

- **Admin** → Full access inside `/admin` (Filament).
- **Team** → All functions in workspace (`/api/app`).
- **Consultant** → Limited collaboration in workspace.
- **Client** → Track, upload, share, comment in workspace.

Authorization = `(role allows area)` **AND** `(user is member of workspace/project)`.

## Development

### Backend (Cursor)
```bash
cd backend
php composer.phar install --no-interaction --prefer-dist
php artisan test
```

### Frontend (VS AI)

```bash
cd frontend
corepack enable && corepack prepare pnpm@8.15.4 --activate
pnpm install --frozen-lockfile
pnpm run -s typecheck
pnpm run -s test -- --run
```

### UI / Storybook (Windsurf)

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm run -s storybook:ci
```

### Diagnostics (Junie / PhpStorm)

Read-only inspections, log mirroring into `public-artifacts/`.

## Definition of Done

* Requests UI supports optimistic comments + assign/status flows.
* A11y lint passes.
* Storybook builds when UI touched.
* Vitest/MSW tests pass in CI.
* Both backend-ci and frontend-ci green on PR.
* Responsive shell works on desktop + iPad.

---
