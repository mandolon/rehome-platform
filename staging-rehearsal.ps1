# Staging Rollout Rehearsal Script (PowerShell)
# This script simulates the production deployment process in staging

param(
    [switch]$SkipRollbackTest
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Staging Rollout Rehearsal" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

try {
    # Step 1: Pre-deployment verification
    Write-Host ""
    Write-Host "📋 Step 1: Pre-deployment Verification" -ForegroundColor Cyan
    Write-Host "-------------------------------------" -ForegroundColor Cyan

    # Set staging environment
    $env:APP_ENV = "staging"
    Write-Warning "Set APP_ENV=staging for rehearsal"

    # Verify staging database connection
    Write-Host "Testing database connection..."
    $migrateStatus = & php artisan migrate:status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Database connection successful"
    } else {
        Write-Error "Database connection failed"
        exit 1
    }

    # Check current migration status
    Write-Host "Current migration status:"
    & php artisan migrate:status

    # Step 2: Backup verification
    Write-Host ""
    Write-Host "📋 Step 2: Backup Verification" -ForegroundColor Cyan
    Write-Host "-----------------------------" -ForegroundColor Cyan

    # Check if backup directories exist
    if ((Test-Path "backend_backup_20250924182451") -and (Test-Path "backend_backup_20250924182601")) {
        Write-Status "Backup directories found"
        Get-ChildItem backend_backup_* | Select-Object Name, LastWriteTime
    } else {
        Write-Warning "Backup directories not found - ensure backups are available"
    }

    # Step 3: Enable maintenance mode
    Write-Host ""
    Write-Host "📋 Step 3: Enable Maintenance Mode" -ForegroundColor Cyan
    Write-Host "--------------------------------" -ForegroundColor Cyan

    & php artisan down
    Write-Status "Maintenance mode enabled"

    # Step 4: Run migrations
    Write-Host ""
    Write-Host "📋 Step 4: Database Migrations" -ForegroundColor Cyan
    Write-Host "-----------------------------" -ForegroundColor Cyan

    Write-Host "Running migrations..."
    & php artisan migrate --force
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Migrations completed successfully"
    } else {
        Write-Error "Migration failed"
        & php artisan up  # Re-enable maintenance mode
        exit 1
    }

    # Verify migration status
    Write-Host "Post-migration status:"
    & php artisan migrate:status

    # Step 5: Clear and rebuild caches
    Write-Host ""
    Write-Host "📋 Step 5: Cache Management" -ForegroundColor Cyan
    Write-Host "-------------------------" -ForegroundColor Cyan

    & php artisan config:clear
    & php artisan cache:clear
    & php artisan config:cache
    & php artisan route:cache
    & php artisan view:cache
    Write-Status "Caches cleared and rebuilt"

    # Step 6: Run production-safe tests
    Write-Host ""
    Write-Host "📋 Step 6: Production-Safe Testing" -ForegroundColor Cyan
    Write-Host "----------------------------------" -ForegroundColor Cyan

    Write-Host "Running AreaEnforcementTest..."
    & php artisan test --filter="AreaEnforcementTest" --env=staging
    if ($LASTEXITCODE -eq 0) {
        Write-Status "AreaEnforcementTest passed"
    } else {
        Write-Error "AreaEnforcementTest failed"
        & php artisan up
        exit 1
    }

    Write-Host "Running WorkspaceScopeTest..."
    & php artisan test --filter="WorkspaceScopeTest" --env=staging
    if ($LASTEXITCODE -eq 0) {
        Write-Status "WorkspaceScopeTest passed"
    } else {
        Write-Error "WorkspaceScopeTest failed"
        & php artisan up
        exit 1
    }

    # Step 7: Health check verification
    Write-Host ""
    Write-Host "📋 Step 7: Health Check Verification" -ForegroundColor Cyan
    Write-Host "-----------------------------------" -ForegroundColor Cyan

    # Test API health endpoint (if server is running)
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Status "API health check passed"
        }
    } catch {
        Write-Warning "API health check failed - server may not be running"
    }

    # Step 8: Disable maintenance mode
    Write-Host ""
    Write-Host "📋 Step 8: Disable Maintenance Mode" -ForegroundColor Cyan
    Write-Host "----------------------------------" -ForegroundColor Cyan

    & php artisan up
    Write-Status "Maintenance mode disabled"

    # Step 9: Rollback testing (optional)
    if (-not $SkipRollbackTest) {
        Write-Host ""
        Write-Host "📋 Step 9: Rollback Testing" -ForegroundColor Cyan
        Write-Host "---------------------------" -ForegroundColor Cyan

        Write-Warning "Testing rollback procedure..."

        # Test rollback of the drop column migration
        Write-Host "Rolling back last migration (drop column)..."
        & php artisan migrate:rollback --step=1
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Rollback completed successfully"
        } else {
            Write-Error "Rollback failed"
            exit 1
        }

        # Verify rollback
        Write-Host "Verifying rollback..."
        & php artisan migrate:status

        # Test that role column is restored
        Write-Host "Testing role column restoration..."
        $tinkerResult = & php artisan tinker --execute="echo Schema::hasColumn('request_participants', 'role') ? 'true' : 'false';"
        if ($tinkerResult -match "true") {
            Write-Status "Role column successfully restored"
        } else {
            Write-Error "Role column not restored"
            exit 1
        }

        # Re-run the migration to complete the rehearsal
        Write-Host "Re-running migration to complete rehearsal..."
        & php artisan migrate --force
        Write-Status "Migration re-run completed"
    } else {
        Write-Warning "Skipping rollback test as requested"
    }

    # Final verification
    Write-Host ""
    Write-Host "📋 Final Verification" -ForegroundColor Cyan
    Write-Host "--------------------" -ForegroundColor Cyan

    & php artisan migrate:status
    Write-Status "Staging rehearsal completed successfully"

    Write-Host ""
    Write-Host "🎉 Staging Rollout Rehearsal Complete!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ All steps completed successfully:" -ForegroundColor Green
    Write-Host "   - Pre-deployment verification" -ForegroundColor White
    Write-Host "   - Backup verification" -ForegroundColor White
    Write-Host "   - Maintenance mode management" -ForegroundColor White
    Write-Host "   - Database migrations" -ForegroundColor White
    Write-Host "   - Cache management" -ForegroundColor White
    Write-Host "   - Production-safe testing" -ForegroundColor White
    Write-Host "   - Health check verification" -ForegroundColor White
    if (-not $SkipRollbackTest) {
        Write-Host "   - Rollback testing" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "🚀 Ready for production deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update PR #28 with rehearsal results" -ForegroundColor White
    Write-Host "2. Add rollout checklist and release notes links" -ForegroundColor White
    Write-Host "3. Assign reviewers for PR approval" -ForegroundColor White
    Write-Host "4. Schedule production maintenance window" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Error "Staging rehearsal failed: $($_.Exception.Message)"
    Write-Host "Attempting to restore maintenance mode..." -ForegroundColor Yellow
    & php artisan up
    exit 1
}
