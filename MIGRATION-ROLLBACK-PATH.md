# 🚨 Critical Migration Rollback Path

## Migration: `2025_09_27_004003_drop_legacy_request_role_columns.php`

### ⚠️ **DESTRUCTIVE OPERATION**: Drops `role` column from `request_participants` table

### Migration Details
```php
// UP: Drops the legacy 'role' column
Schema::table('request_participants', function (Blueprint $table) {
    $table->dropColumn('role');
});

// DOWN: Restores the 'role' column for rollback
Schema::table('request_participants', function (Blueprint $table) {
    $table->enum('role', ['viewer', 'contributor', 'manager'])->default('viewer');
});
```

### Rollback Commands

#### Single Migration Rollback
```bash
# Rollback only the drop column migration
php artisan migrate:rollback --step=1

# Verify rollback success
php artisan migrate:status
```

#### Full Migration Rollback (if needed)
```bash
# Rollback all migrations from this batch
php artisan migrate:rollback

# Or rollback to specific batch
php artisan migrate:rollback --batch=[batch_number]
```

### Pre-Rollback Verification
```bash
# Check current migration status
php artisan migrate:status

# Verify request_participants table structure
php artisan tinker
>>> Schema::getColumnListing('request_participants')
```

### Post-Rollback Verification
```bash
# Verify role column is restored
php artisan tinker
>>> Schema::hasColumn('request_participants', 'role')

# Test that role column accepts expected values
>>> DB::table('request_participants')->insert(['role' => 'viewer'])
```

### Data Recovery Considerations
- **Data Loss**: The `role` column data will be lost when dropped
- **Recovery**: Rollback restores column structure but NOT the original data
- **Mitigation**: Ensure backup includes data before migration

### Emergency Procedures
1. **Immediate Rollback**: `php artisan migrate:rollback --step=1`
2. **Verify Structure**: Check table schema is restored
3. **Test Application**: Ensure app functions with restored column
4. **Data Recovery**: Restore from backup if data is needed

---

## 🧪 Staging Rehearsal Commands

### Pre-Staging Setup
```bash
# Switch to staging environment
export APP_ENV=staging

# Verify staging database
php artisan migrate:status
```

### Staging Deployment Rehearsal
```bash
# 1. Enable maintenance mode
php artisan down

# 2. Run migrations (including drop column)
php artisan migrate --force

# 3. Clear caches
php artisan config:clear && php artisan cache:clear

# 4. Run production-safe tests
php artisan test --filter="AreaEnforcementTest|WorkspaceScopeTest" --env=staging

# 5. Disable maintenance mode
php artisan up
```

### Staging Rollback Test
```bash
# Test rollback procedure
php artisan migrate:rollback --step=1

# Verify rollback success
php artisan migrate:status
php artisan tinker
>>> Schema::hasColumn('request_participants', 'role')
```

### Staging Verification
```bash
# Health checks
curl -X GET http://staging-domain.com/api/health
curl -X GET http://staging-domain.com/admin/health

# Authentication flow
curl -X GET http://staging-domain.com/sanctum/csrf-cookie
```

---

## 📋 PR #28 Enhancement Checklist

### Add to PR Description
- [ ] Link to `PRODUCTION-ROLLOUT-CHECKLIST.md`
- [ ] Link to `PRODUCTION-RELEASE-NOTES.md`
- [ ] Note critical migration rollback path
- [ ] Document staging rehearsal results
- [ ] Include rollback testing verification

### PR Review Requirements
- [ ] Staging rehearsal completed successfully
- [ ] Rollback procedure tested and verified
- [ ] Production-safe tests passing
- [ ] Migration rollback path documented
- [ ] Emergency procedures documented

---

*This rollback path is critical for the drop column migration and must be tested in staging before production deployment.*
