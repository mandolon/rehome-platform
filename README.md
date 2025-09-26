# Rehome Platform

## Vision Statement

Rehome is the all-in-one operating system for residential construction, connecting the full journey from design to permits to build. It gives clients a clear portal to track progress and share documents, provides teams with real-time tools to draft, review, and manage work, and offers consultants a focused space to comment and collaborate. Built on a unified backend (Laravel) and frontend (Next.js), Rehome combines smooth UX with automated AI support for tasks, tests, and CI. The result is a single, responsive platform where homeowners, architects, engineers, and planners can work together seamlessly — reducing friction, cutting delays, and making construction simple.

Multi-role collaborative platform for architecture and construction teams. Features project management, task tracking, team collaboration, and client portals with real-time updates.

## Authorization (Simplified RBAC)

**Principle:** Everyone can **read, write, edit, comment, upload**.  
**Roles only decide _where_ you act**, not _what_ you can do.

- **Roles:** `ADMIN | TEAM | CONSULTANT | CLIENT`
- **Areas:**
  - `ADMIN` → Admin (Filament) at `/admin/*`
  - `TEAM / CONSULTANT / CLIENT` → SPA at `/api/app/*`

**Effective rule =** (Role allows area) **AND** (User is a member of the workspace/project).

We **do not** use request-level roles (Manager/Contributor/Viewer/Creator) or per-action matrices.

### Cursor Runbook: RBAC Implementation Steps

**1. Feature Flag Setup**
```bash
cd backend
echo "SIMPLE_RBAC=false" >> .env
```

**2. Configuration**
```php
// config/rbac.php
return [
    'enabled' => (bool) env('SIMPLE_RBAC', false),
    'areas' => [
        'admin' => ['ADMIN'],
        'spa'   => ['TEAM','CONSULTANT','CLIENT'],
    ],
];
```

**3. Middleware Creation**
```php
// app/Http/Middleware/EnsureRole.php
class EnsureRole {
    public function handle(Request $request, Closure $next, ...$roles) {
        if (!config('rbac.enabled')) return $next($request);
        $user = $request->user();
        if (!$user) abort(401);
        $role = strtoupper($user->role ?? '');
        $allowed = $roles ?: $this->allowedRoles;
        if (!in_array($role, array_map('strtoupper', $allowed), true)) {
            abort(403);
        }
        return $next($request);
    }
}

// app/Http/Middleware/ScopeWorkspace.php
class ScopeWorkspace {
    public function handle(Request $request, Closure $next) {
        if (!config('rbac.enabled')) return $next($request);
        $workspaceId = $request->route('workspace') ?? $request->header('X-Workspace-Id');
        abort_if(!$workspaceId, 400, 'Workspace required');
        $user = $request->user();
        $isMember = $user->workspaces()->whereKey($workspaceId)->exists();
        abort_if(!$isMember, 403);
        app()->instance('currentWorkspaceId', $workspaceId);
        return $next($request);
    }
}
```

**4. Policy Base**
```php
// app/Policies/BaseScopedPolicy.php
abstract class BaseScopedPolicy {
    public function before(User $user, string $ability): ?bool {
        if (!config('rbac.enabled')) return null;
        return null; // Defer to workspace membership checks
    }
    protected function isMember(User $user, $workspaceId): bool {
        return $user->workspaces()->whereKey($workspaceId)->exists();
    }
}
```

**5. Route Wiring**
```php
// routes/web.php (Admin only)
Route::middleware(['auth', 'ensureRole:ADMIN'])
    ->prefix('admin')
    ->group(function () {
        Route::get('/tasks', fn() => 'admin tasks');
        Route::get('/dashboard', fn() => 'admin dashboard');
    });

// routes/api.php (SPA with workspace scoping)
Route::middleware(['auth:sanctum', 'ensureRole:TEAM,CONSULTANT,CLIENT', 'scopeWorkspace'])
    ->prefix('api/app')
    ->group(function () {
        Route::get('/workspaces/{workspace}/projects', function ($workspace) {
            return response()->json(['workspace' => $workspace, 'projects' => []]);
        });
        // ... other SPA routes
    });
```

**6. Middleware Registration**
```php
// app/Providers/RouteServiceProvider.php
public function boot(): void {
    $router = $this->app['router'];
    $router->aliasMiddleware('ensureRole', \App\Http\Middleware\EnsureRole::class);
    $router->aliasMiddleware('scopeWorkspace', \App\Http\Middleware\ScopeWorkspace::class);
    // ... rest of boot method
}
```

**7. User Model Updates**
```php
// app/Models/User.php
public function workspaces(): BelongsToMany {
    return $this->belongsToMany(Workspace::class);
}

public function isRole(string $role): bool {
    return strtoupper($this->role ?? '') === strtoupper($role);
}
```

**8. Test Suite**
```php
// tests/Feature/RbacWiringTest.php
class RbacWiringTest extends TestCase {
    protected function setUp(): void {
        parent::setUp();
        config(['rbac.enabled' => true]);
    }
    
    public function test_blocks_non_admin_from_admin_routes() {
        $user = User::factory()->create(['role' => 'TEAM']);
        Sanctum::actingAs($user);
        $this->get('/admin/tasks')->assertForbidden();
    }
    
    public function test_allows_team_in_spa_when_member() {
        $user = User::factory()->create(['role' => 'TEAM']);
        $workspace = Workspace::factory()->create();
        $user->workspaces()->attach($workspace->id);
        Sanctum::actingAs($user);
        $this->get("/api/app/workspaces/{$workspace->id}/projects")->assertOk();
    }
    // ... additional test cases
}
```

**9. Validation Commands**
```bash
cd backend
php artisan test --filter="RbacWiringTest"
php artisan route:list | grep -E "(admin|api/app)"
```

**10. Rollout Process**
- Deploy with `SIMPLE_RBAC=false` (default)
- Test in staging with `SIMPLE_RBAC=true`
- Monitor for issues
- Enable in production when ready
- Remove legacy RBAC in follow-up PR

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
