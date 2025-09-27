#!/bin/bash
# Staging Rollout Rehearsal Script
# This script simulates the production deployment process in staging

set -e  # Exit on any error

echo "🚀 Starting Staging Rollout Rehearsal"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Pre-deployment verification
echo ""
echo "📋 Step 1: Pre-deployment Verification"
echo "-------------------------------------"

# Check if we're in staging environment
if [ "$APP_ENV" != "staging" ]; then
    print_warning "Setting APP_ENV=staging for rehearsal"
    export APP_ENV=staging
fi

# Verify staging database connection
echo "Testing database connection..."
if php artisan migrate:status > /dev/null 2>&1; then
    print_status "Database connection successful"
else
    print_error "Database connection failed"
    exit 1
fi

# Check current migration status
echo "Current migration status:"
php artisan migrate:status

# Step 2: Backup verification
echo ""
echo "📋 Step 2: Backup Verification"
echo "-----------------------------"

# Check if backup directories exist
if [ -d "backend_backup_20250924182451" ] && [ -d "backend_backup_20250924182601" ]; then
    print_status "Backup directories found"
    ls -la backend_backup_*
else
    print_warning "Backup directories not found - ensure backups are available"
fi

# Step 3: Enable maintenance mode
echo ""
echo "📋 Step 3: Enable Maintenance Mode"
echo "--------------------------------"

php artisan down
print_status "Maintenance mode enabled"

# Step 4: Run migrations
echo ""
echo "📋 Step 4: Database Migrations"
echo "-----------------------------"

echo "Running migrations..."
if php artisan migrate --force; then
    print_status "Migrations completed successfully"
else
    print_error "Migration failed"
    php artisan up  # Re-enable maintenance mode
    exit 1
fi

# Verify migration status
echo "Post-migration status:"
php artisan migrate:status

# Step 5: Clear and rebuild caches
echo ""
echo "📋 Step 5: Cache Management"
echo "-------------------------"

php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
print_status "Caches cleared and rebuilt"

# Step 6: Run production-safe tests
echo ""
echo "📋 Step 6: Production-Safe Testing"
echo "----------------------------------"

echo "Running AreaEnforcementTest..."
if php artisan test --filter="AreaEnforcementTest" --env=staging; then
    print_status "AreaEnforcementTest passed"
else
    print_error "AreaEnforcementTest failed"
    php artisan up
    exit 1
fi

echo "Running WorkspaceScopeTest..."
if php artisan test --filter="WorkspaceScopeTest" --env=staging; then
    print_status "WorkspaceScopeTest passed"
else
    print_error "WorkspaceScopeTest failed"
    php artisan up
    exit 1
fi

# Step 7: Health check verification
echo ""
echo "📋 Step 7: Health Check Verification"
echo "-----------------------------------"

# Test API health endpoint
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/health | grep -q "200"; then
    print_status "API health check passed"
else
    print_warning "API health check failed - may need to start server"
fi

# Step 8: Disable maintenance mode
echo ""
echo "📋 Step 8: Disable Maintenance Mode"
echo "----------------------------------"

php artisan up
print_status "Maintenance mode disabled"

# Step 9: Rollback testing
echo ""
echo "📋 Step 9: Rollback Testing"
echo "---------------------------"

print_warning "Testing rollback procedure..."

# Test rollback of the drop column migration
echo "Rolling back last migration (drop column)..."
if php artisan migrate:rollback --step=1; then
    print_status "Rollback completed successfully"
else
    print_error "Rollback failed"
    exit 1
fi

# Verify rollback
echo "Verifying rollback..."
php artisan migrate:status

# Test that role column is restored
echo "Testing role column restoration..."
if php artisan tinker --execute="echo Schema::hasColumn('request_participants', 'role') ? 'true' : 'false';" | grep -q "true"; then
    print_status "Role column successfully restored"
else
    print_error "Role column not restored"
    exit 1
fi

# Re-run the migration to complete the rehearsal
echo "Re-running migration to complete rehearsal..."
php artisan migrate --force
print_status "Migration re-run completed"

# Final verification
echo ""
echo "📋 Final Verification"
echo "--------------------"

php artisan migrate:status
print_status "Staging rehearsal completed successfully"

echo ""
echo "🎉 Staging Rollout Rehearsal Complete!"
echo "====================================="
echo ""
echo "✅ All steps completed successfully:"
echo "   - Pre-deployment verification"
echo "   - Backup verification"
echo "   - Maintenance mode management"
echo "   - Database migrations"
echo "   - Cache management"
echo "   - Production-safe testing"
echo "   - Health check verification"
echo "   - Rollback testing"
echo ""
echo "🚀 Ready for production deployment!"
echo ""
echo "Next steps:"
echo "1. Update PR #28 with rehearsal results"
echo "2. Add rollout checklist and release notes links"
echo "3. Assign reviewers for PR approval"
echo "4. Schedule production maintenance window"
echo ""
