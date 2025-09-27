# 🚀 Production Rollout Checklist

## ⚠️ CRITICAL: DO NOT EXECUTE DESTRUCTIVE OPERATIONS WITHOUT CONFIRMATION

This checklist prepares all necessary steps for production deployment. **Execute destructive operations only after explicit confirmation.**

---

## 📋 Pre-Deployment Checklist

### 1. Backup Verification ✅
- [ ] **Database Backup**: Confirm current database backup exists and is accessible
  - Backup locations detected: `backend_backup_20250924182451/`, `backend_backup_20250924182601/`
  - [ ] Verify backup integrity and completeness
  - [ ] Test restore procedure in staging environment
  - [ ] Document backup timestamp and location

- [ ] **Code Backup**: Confirm current codebase is backed up
  - [ ] Git repository is pushed to remote
  - [ ] Tag current version for rollback reference
  - [ ] Document current commit hash

- [ ] **Configuration Backup**: Backup production configuration files
  - [ ] `.env` file backup
  - [ ] Database connection strings
  - [ ] API keys and secrets

### 2. Environment Preparation ✅
- [ ] **Production Environment**: Verify production server is ready
  - [ ] Server resources (CPU, RAM, disk space)
  - [ ] PHP 8.2+ installed and configured
  - [ ] Composer dependencies installed (`composer install --no-dev --optimize-autoloader`)
  - [ ] Node.js and npm/pnpm for frontend assets

- [ ] **Database**: Production database is accessible and configured
  - [ ] Database connection tested
  - [ ] Migration table exists
  - [ ] Current migration status verified

### 3. Test Suite Verification ✅
- [ ] **AreaEnforcementTest**: Verify role-based access controls
  - [ ] Admin users cannot access SPA routes (403 expected)
  - [ ] Non-admin users cannot access admin routes (403 expected)
  - [ ] SPA roles can access SPA routes with proper workspace membership

- [ ] **WorkspaceScopeTest**: Verify workspace isolation
  - [ ] Workspace members can perform CRUD operations
  - [ ] Non-members are blocked (403 expected)
  - [ ] Missing workspace header returns 400
  - [ ] Non-existent workspace returns 403

- [ ] **Production-Safe Test Mode**: Configure tests for read-only verification
  - [ ] Health check endpoints (`/api/health`, `/admin/health`, `/api/app/health`)
  - [ ] Authentication flow verification
  - [ ] CORS configuration testing

---

## 🔧 Deployment Steps

### Step 1: Enable Maintenance Mode
```bash
php artisan down
```
**Status**: ⏸️ **PREPARED** - Ready to execute

### Step 2: Deploy Backend Code
```bash
# Deploy application code
# Update dependencies
composer install --no-dev --optimize-autoloader

# Clear and cache configuration
php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```
**Status**: ⏸️ **PREPARED** - Ready to execute

### Step 3: Database Migration
```bash
php artisan migrate --force
```
**Status**: ⏸️ **PREPARED** - Ready to execute

**Migration Files to Process** (15 total):
- `0001_01_01_000000_create_users_table.php`
- `0001_01_01_000001_create_cache_table.php`
- `0001_01_01_000002_create_jobs_table.php`
- `2025_09_26_083031_create_requests_table.php`
- `2025_09_26_083033_create_request_comments_table.php`
- `2025_09_26_083035_create_request_participants_table.php`
- `2025_09_26_083845_create_personal_access_tokens_table.php`
- `2025_09_26_181240_create_workspaces_table.php`
- `2025_09_26_181722_add_role_to_users_table.php`
- `2025_09_26_203215_add_unique_participant_per_user_per_request.php`
- `2025_09_26_210000_create_workspace_members_table.php`
- `2025_09_26_222031_update_user_role_enum_values.php`
- `2025_09_26_222120_create_user_workspace_table.php`
- `2025_09_27_000643_add_todo_drop_request_participants_role_column.php`
- `2025_09_27_004003_drop_legacy_request_role_columns.php`

### Step 4: Production-Safe Testing
```bash
# Run read-only tests to verify deployment
php artisan test --filter="AreaEnforcementTest|WorkspaceScopeTest" --env=production
```
**Status**: ⏸️ **PREPARED** - Ready to execute

**Test Coverage**:
- Role-based access enforcement
- Workspace scope isolation
- Health check endpoints
- Authentication flow

### Step 5: Disable Maintenance Mode
```bash
php artisan up
```
**Status**: ⏸️ **PREPARED** - Ready to execute

---

## 🧪 Post-Deployment Verification

### Critical Health Checks
- [ ] **API Health**: `GET /api/health` returns 200
- [ ] **Admin Health**: `GET /admin/health` returns 200 (admin only)
- [ ] **SPA Health**: `GET /api/app/health` returns 200 (with workspace header)

### Authentication Flow Testing
- [ ] **CSRF Bootstrap**: `GET /sanctum/csrf-cookie` returns 204
- [ ] **Login**: `POST /api/auth/login` returns 200
- [ ] **User Info**: `GET /api/auth/me` returns 200
- [ ] **Logout**: `POST /api/auth/logout` clears session

### Role-Based Access Testing
- [ ] **Admin Access**: Admin can access `/admin/*` routes
- [ ] **Admin Blocked**: Admin cannot access `/api/app/*` routes
- [ ] **SPA Access**: TEAM/CONSULTANT/CLIENT can access `/api/app/*` with workspace
- [ ] **SPA Blocked**: Non-members cannot access workspace resources

### Performance Verification
- [ ] **Response Times**: All endpoints respond within acceptable limits
- [ ] **Database Performance**: Queries execute efficiently
- [ ] **Cache Performance**: Caching is working correctly

---

## 🚨 Rollback Procedures

### Emergency Rollback Commands
```bash
# If issues detected, execute rollback immediately
php artisan down
php artisan migrate:rollback --force
# Restore from backup if necessary
php artisan up
```

### Rollback Triggers
- [ ] Health checks fail
- [ ] Authentication flow broken
- [ ] Database errors detected
- [ ] Performance degradation
- [ ] User reports critical issues

---

## 📊 Release Notes Template

### Version: [VERSION_NUMBER]
**Deployment Date**: [DATE]
**Deployment Time**: [TIME]

#### Changes Included
- [List of changes/features]

#### Database Changes
- 15 migration files processed
- New tables: requests, request_comments, workspaces, workspace_members
- Updated user roles and permissions

#### Testing Performed
- AreaEnforcementTest: Role-based access controls verified
- WorkspaceScopeTest: Workspace isolation verified
- Health check endpoints tested
- Authentication flow verified

#### Commands Executed
```bash
php artisan down
php artisan migrate --force
php artisan config:clear && php artisan cache:clear
php artisan test --filter="AreaEnforcementTest|WorkspaceScopeTest"
php artisan up
```

#### Post-Deployment Status
- [ ] All health checks passing
- [ ] Authentication working correctly
- [ ] Role-based access enforced
- [ ] Workspace isolation working
- [ ] Performance within acceptable limits

---

## ✅ Final Checklist

### Before Deployment
- [ ] All backups verified and accessible
- [ ] Test suite passes in staging
- [ ] Production environment prepared
- [ ] Rollback plan documented

### During Deployment
- [ ] Maintenance mode enabled
- [ ] Code deployed successfully
- [ ] Database migrations completed
- [ ] Configuration cached
- [ ] Tests executed successfully
- [ ] Maintenance mode disabled

### After Deployment
- [ ] Health checks passing
- [ ] Authentication flow verified
- [ ] Role-based access working
- [ ] Performance acceptable
- [ ] User acceptance testing completed

---

## 🎯 Success Criteria

**✅ Deployment is successful when:**
1. All health check endpoints return 200
2. Authentication flow works end-to-end
3. Role-based access controls are enforced
4. Workspace isolation is working
5. No critical errors in logs
6. Performance metrics are within acceptable ranges

**🚨 Rollback immediately if:**
1. Any health check fails
2. Authentication is broken
3. Database errors occur
4. Performance degrades significantly
5. Users report critical issues

---

*This checklist ensures a safe, methodical production deployment with proper testing and rollback procedures.*
