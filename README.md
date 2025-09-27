# Rehome • AI Prompts & Ops Handbook

This repo holds copy-paste prompts, guardrails, and runbooks for **Cursor, VS AI, Windsurf, and Junie (PhpStorm)** in the `rehome-platform` monorepo.

## Purpose
- Keep backend (Laravel) and frontend (Next.js) in sync.
- Run AI tasks consistently with minimal churn.
- Make sure backend-ci and frontend-ci stay green.
- Use slim, CI-only gates.

## Agents
- **Cursor** → backend (`backend/**`, scripts, backend-ci).
- **VS AI** → frontend + CI (`frontend/**`, frontend-ci).
- **Windsurf** → UI + Storybook (frontend UI only).
- **Junie (PhpStorm)** → diagnostics only (logs, inspections, no code changes).

## Routing
Prompts respond only when message starts with one of:  
`from: vs ai ...`, `from: cursor ...`, `from: windsurf ...`, `from: junie ...`

## Guardrails
- No Laravel scaffolding outside `backend/`.
- Pre-flight tripwire = warn only, never block.
- Proof of green = CI runs on PR.
- Local artifacts optional.

## Slim Gates
- **BE (Backend-CI)** → backend-ci green on PR.
- **FE (Frontend-CI)** → frontend-ci green on PR.  
  Storybook runs only if UI files changed.

## Pre-Flight Quick Commands
- **Cursor**:  
  ```bash
  cd backend
  php composer.phar install --no-interaction --prefer-dist
  php artisan test
  ```

* **VS AI**:

  ```bash
  cd frontend
  corepack enable && corepack prepare pnpm@8.15.4 --activate
  pnpm install --frozen-lockfile
  pnpm run -s typecheck
  pnpm run -s test -- --run
  ```
* **Windsurf**:

  ```bash
  cd frontend
  pnpm install --frozen-lockfile
  pnpm run -s storybook:ci
  ```
* **Junie**: mirror `.gate*/` logs into `public-artifacts/` + inspect configs (read-only)

---

## RBAC (Simple)

**Principle:** Everyone can **read, write, edit, comment, upload**.  
**Roles only decide _where_ you act**, not _what_ you can do.

### Roles & Areas
- **ADMIN** → Admin area (`/admin/*`) - Filament panels, task boards
- **TEAM** → SPA area (`/api/app/*`) - Full workspace functions
- **CONSULTANT** → SPA area (`/api/app/*`) - Limited collaboration + comments
- **CLIENT** → SPA area (`/api/app/*`) - Focused tracking + sharing

### Authorization Rule
`(role allows area) AND (user is member of workspace/project)`

### Health Checks
- **Admin**: `GET /admin/health` (ADMIN role required)
- **SPA**: `GET /api/app/health` (TEAM/CONSULTANT/CLIENT + workspace membership)

### Workspace Creation
- **Admin API**: `POST /admin/workspaces` (ADMIN role required)
- **Tinker**: `php artisan tinker --execute="..."`

---

## Cursor RBAC Simplification Runbook

### 10-Step Implementation Guide

1. **Configuration**
   Create `config/rbac.php` with roles: `ADMIN`, `TEAM`, `CONSULTANT`, `CLIENT`.

2. **Middleware Creation**

   * `EnsureRole` → checks if user role allows admin vs SPA.
   * `ScopeWorkspace` → ensures user is in workspace.

3. **Policy Base**
   Add `BaseScopedPolicy` abstract class for workspace-scoped policies.

4. **Route Protection**
   Apply middleware to admin and SPA routes.

5. **Test Coverage**
   Create tests for role enforcement and workspace scoping.

6. **Database Migration**
   Add role column to users table.

7. **Factory Updates**
   Update user factories to include role field.

8. **Seeder Updates**
   Create users with appropriate roles.

9. **Documentation**
   Update API documentation to reflect new RBAC model.

10. **Deployment**
    Deploy with proper role assignments.

---

## Definition of Done (Project Level)

* Requests UI with optimistic comments + assign/status flows.
* A11y lint passes; Storybook builds when UI touched.
* Vitest/MSW tests pass in CI.
* Both backend-ci and frontend-ci green on PR.
* Responsive shell works on desktop + iPad.

---

⚠️ **Reminder:** Only output prompts when message starts with `from:` and names a specific agent.