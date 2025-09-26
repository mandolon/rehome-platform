# RBAC Cleanup PR

## Title
refactor(rbac): remove legacy RBAC + flag, enforce area+workspace guards

## Summary
- Deletes legacy per-request RBAC and `/api/requests` routes
- Makes `EnsureRole` + `ScopeWorkspace` always-on
- Keeps admin at `/admin/*`, SPA at `/api/app/*` with workspace scope
- Removes SIMPLE_RBAC feature flag and all conditional logic

## Changes Made

### Configuration
- ✅ Removed `SIMPLE_RBAC` config from `backend/config/app.php`
- ✅ Removed `SIMPLE_RBAC` from `.env` files

### Middleware
- ✅ `EnsureRole` middleware now always enforces role checks
- ✅ `ScopeWorkspace` middleware now always enforces workspace membership
- ✅ Removed all `config('app.simple_rbac')` conditional logic

### Routes
- ✅ Removed legacy `/api/requests` route groups
- ✅ Kept only new route structure:
  - `/api/admin/*` → `auth` + `role:admin`
  - `/api/app/*` → `auth:sanctum` + `role:manager,contributor,viewer` + `scope.workspace`

### Policies
- ✅ `BaseScopedPolicy` now always enforces workspace membership
- ✅ Admin users bypass all checks
- ✅ Non-admin users must be workspace members for CRUD operations

### Tests
- ✅ Kept `AreaAccessTest` and `WorkspaceScopeTest` (simplified RBAC tests)
- ✅ Removed legacy test files:
  - `RequestsFeatureTest.php`
  - `Requests/AuthorizationTest.php`
  - `Requests/FilteringTest.php`
  - `Requests/ParticipantsTest.php`
  - `Requests/PerformanceTest.php`
- ✅ Removed `SimpleRbacTest.php` (flag testing)

## Test Results
```
Tests:    43 passed (50 assertions)
Duration: 4.16s
```

### Key Test Coverage
- ✅ Admin users can access `/api/admin/*` routes
- ✅ Non-admin users get 403 for admin routes
- ✅ Workspace members can perform CRUD operations
- ✅ Non-members get 403 for workspace resources
- ✅ Missing workspace ID returns 400
- ✅ Non-existent workspace returns 404
- ✅ Wrong workspace returns 403

## Migration/Config
- ✅ Removes SIMPLE_RBAC env/config completely
- ✅ No database migrations needed
- ✅ Middleware aliases remain registered in `bootstrap/app.php`

## Rollback Plan
If issues arise, can revert this commit to restore:
- Legacy `/api/requests` routes
- SIMPLE_RBAC feature flag
- Conditional middleware behavior
- Legacy test files

## Breaking Changes
- ❌ `/api/requests` routes no longer exist
- ❌ All API requests must include workspace context
- ❌ Role-based area access is now enforced
- ❌ Legacy RBAC policies are removed

## Next Steps
1. Deploy to staging for validation
2. Update frontend to use new `/api/app/*` routes
3. Update API documentation
4. Monitor for any issues in production
