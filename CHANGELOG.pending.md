# CHANGELOG.pending.md

## v0.8.0 - RBAC Cleanup & Legacy Removal (2025-01-27)

### 🚀 Major Changes
- **RBAC Simplification**: Removed SIMPLE_RBAC flag and unified authentication system
- **Legacy Cleanup**: Eliminated legacy per-request role system
- **CI Unification**: Collapsed CI matrix to single test run
- **Area Enforcement**: Implemented area-based access control (admin vs app)

### ✨ New Features
- **Simplified RBAC**: Area-only guards with 4 roles (ADMIN, TEAM, CONSULTANT, CLIENT)
- **Workspace Isolation**: Enforced workspace scoping for SPA routes
- **Production Rollout**: Comprehensive deployment checklist and release notes
- **Migration Safety**: Drop column migration with proper rollback procedures

### 🔧 Technical Improvements
- **Database Schema**: Removed legacy `role` column from `request_participants` table
- **Test Coverage**: Added AreaEnforcementTest and WorkspaceScopeTest
- **Documentation**: Comprehensive production rollout documentation
- **Staging Validation**: Full staging rehearsal scripts and procedures

### 🧪 Testing & Quality
- **Gate Tests**: Added RoleGate test coverage
- **Health Checks**: Validated admin and app area health endpoints
- **Production-Safe Tests**: Read-only endpoint verification
- **Rollback Testing**: Comprehensive migration rollback procedures

### 📚 Documentation
- **Production Checklist**: Complete deployment checklist with safety measures
- **Release Notes**: Detailed release notes with deployment commands
- **Migration Rollback**: Critical migration rollback path documentation
- **RBAC Runbook**: Comprehensive Cursor RBAC runbook

### 🗑️ Removed
- **SIMPLE_RBAC Flag**: Eliminated conditional code paths
- **Legacy Request Roles**: Removed per-request role system
- **Legacy Staging Files**: Cleaned up staging configuration files
- **CI Matrix**: Simplified to single test execution

### 🔄 Migration Changes
- **Drop Column**: `request_participants.role` column removed
- **Rollback Support**: Proper rollback procedures for all migrations
- **Schema Updates**: Updated user roles and workspace relationships

### 🚨 Breaking Changes
- **Authentication**: Simplified RBAC system (no more per-request roles)
- **API Routes**: Area-based access control enforced
- **Database**: Legacy role columns removed

### 📋 Commits Included
* docs: remove SIMPLE_RBAC references and legacy staging files
* fix(frontend): SB auth stub + RoleGate test; capture verification logs        
* rbac: remove SIMPLE_RBAC flag, legacy request roles; unify CI
* feat: SIMPLE_RBAC staging flip validated (admin/app areas, 4 roles)
* chore(staging): enable SIMPLE_RBAC in staging and validate routes/health/tests
* feat(rbac): remove legacy per-request roles; enforce area+workspace model; update tests and UI gates
* chore(staging): enable SIMPLE_RBAC in staging and verify health/workspace endpoints
* docs: add comprehensive Cursor RBAC runbook to README
* docs: enforce single root README; cleanup extras and add remediation log
* feat(rbac): implement simplified RBAC with area-only guards

### 🎯 Production Readiness
- ✅ Staging rehearsal scripts prepared
- ✅ Rollback procedures documented
- ✅ Production-safe tests ready
- ✅ Emergency procedures documented
- ✅ Deployment checklist complete

### 🚀 Deployment Commands
```bash
php artisan down
php artisan migrate --force
php artisan config:clear && php artisan cache:clear
php artisan up
```

### 🧪 Production-Safe Testing
```bash
php artisan test --filter="AreaEnforcementTest|WorkspaceScopeTest" --env=production
```

### 🚨 Emergency Rollback
```bash
php artisan down
php artisan migrate:rollback --step=1
php artisan up
```

---

**Full Changelog**: This is the first tagged release (v0.8.0)
