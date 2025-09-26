# Rehome — Multi-Agent Runbook (Slim Gates, PhpStorm Edition)

## Scope
- Apps: SPA (Next.js) + Admin (Filament). Targets: web ≥1280, desktop, iPad ≥768.
- Roles: Admin, Manager, Contributor, Viewer.

## Routing Rule (strict)
- Only respond with a prompt when the user says:
  `from: vs ai ...`, `from: cursor ...`, `from: windsurf ...`, or `from: junie ...`.
- Prompt format:

AgentName  
Goal: <single sentence>  
Interlocks: <who this un/blocks>  
Tasks:  
- <tight, runnable steps/commands>  
DoD:  
- <verifiable checks/links>  

## Global Guardrails
- **G0 Path Scope**
  - **Cursor**: may change only `backend/**`, `scripts/**` (backend-related), `.github/workflows/backend-ci.yml`.
  - **VS AI**: may change only `frontend/**`, `.github/workflows/frontend-ci.yml`, repo docs referencing CI.
  - **Windsurf**: may change only `frontend/**` UI & Storybook files; never workflows or backend.
  - **Junie (PhpStorm)**: **diagnostic only** — read configs, mirror logs to `public-artifacts/**`, print tails; **never writes code**.
- **G1 No Root Laravel Scaffolding**
  - Never create `app/`, `artisan`, `routes/`, `database/`, or `composer.json` outside `backend/`.
- **G2 Pre-Flight Tripwire (warn-only)**
  - `git status --porcelain=v1` → if dirty/untracked outside allowed scope, **warn** and continue; do not block.
- **G3 Concurrency Guard**
  - If a workflow edit crosses ownership, reply **PAUSE** and request the owner to proceed.
- **G4 CI Discipline**
  - Small, atomic PRs; verify green checks before merging.
- **G5 Artisan/Generators Only (backend)**
  - Use `php artisan make:*` and edit generated files.
- **G6 Revert/Contain Strays**
  - Any file outside allowed scope → do not stage; follow-up PR if truly needed.
- **G7 Proof-of-Green**
  - CI run links posted in PR comments. Local artifacts optional (do not gate).

## Slim Gates (fast path)
- **Gate B (Backend-CI)**: `backend-ci` green on PR. Owner: Cursor.
- **Gate F (Frontend-CI)**: `frontend-ci` green on PR. Storybook build runs only when UI files change. Owners: VS AI/Windsurf.
- **Junie**: non-gating diagnostics; mirrors Gate B/F logs; no code edits.

## Agent Pre-Flight (light)
- **Cursor (backend)**
  - `cd backend`
  - `php composer.phar install --no-interaction --prefer-dist`
  - `php artisan test`
- **VS AI (frontend/CI)**
  - `cd frontend`
  - `corepack enable && corepack prepare pnpm@8.15.4 --activate`
  - `pnpm install --frozen-lockfile`
  - `pnpm run -s typecheck && pnpm run -s test -- --run`
- **Windsurf (UI/Storybook)**
  - `cd frontend`
  - `pnpm install --frozen-lockfile`
  - `pnpm run -s storybook:ci` (only when UI changes)
- **Junie (PhpStorm; read-only)**
  - Mirror `.gate*/` to `public-artifacts/**`; tail last 200 lines; inspect package/workflows. No composer/pnpm, no `artisan`.

## Commit/PR Hygiene
- New branch per task, minimal diff.
- Only stage files under the agent's allowed paths.
- Include CI run URLs in PR comment.
- If CI red → fix or revert.

## Definition of Done (project)
- Requests list/detail with optimistic comments; assign/status flows.
- A11y lint passes; Storybook v8.6.14 builds (when UI touched).
- MSW/Vitest tests pass in CI.
- **Both CI workflows green** on PR.
- Responsive shell for desktop + iPad (sticky bars, touch targets).

## PAUSE Templates
- **Windsurf (workflow ownership)**
  - Goal: WAIT — Workflow file is owned by VS AI.  
  - Tasks: Skip changes; request VS AI to modify `.github/workflows/frontend-ci.yml`.  
  - DoD: PR link from VS AI with green checks.
- **VS AI (backend workflow ownership)**
  - Goal: WAIT — Backend workflow is owned by Cursor.  
  - Tasks: Skip changes; request Cursor to modify `.github/workflows/backend-ci.yml`.  
  - DoD: PR link from Cursor with green checks.

## Junie Procedures (Windows PowerShell)
- Allowed: create `public-artifacts/**`, copy `.gate*/**` into it, read/print tails, read configs/workflows.
- Forbidden: editing any source under `backend/**`, `frontend/**`, `.github/**`; running installers; `php artisan`; `pnpm` commands; `git add/commit/rebase`.
- Example (safe):
  - `New-Item -ItemType Directory -Force public-artifacts\gate-b`
  - `Copy-Item .gateb_artifacts\* public-artifacts\gate-b\ -Recurse -Force -ErrorAction SilentlyContinue`
  - `Get-Content public-artifacts\gate-b\*.md -Tail 200`