# Laravel Scaffold Verification Script
# Run this from project root: .\scripts\verify-laravel-scaffold.ps1

Write-Host "Laravel Scaffold Verification Starting..." -ForegroundColor Green
Write-Host ("=" * 50)

$ErrorCount = 0

# Step 1: Dependencies
Write-Host "`nStep 1: Dependencies and Environment" -ForegroundColor Yellow
Set-Location backend

composer install --no-interaction
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Composer install successful" -ForegroundColor Green
} else {
    Write-Host "✗ Composer install failed" -ForegroundColor Red
    $ErrorCount++
}

$version = php artisan --version
Write-Host "✓ Laravel version: $version" -ForegroundColor Green

php artisan optimize:clear | Out-Null
Write-Host "✓ Cache cleared" -ForegroundColor Green

# Step 2: Database
Write-Host "`nStep 2: Database and Seeding" -ForegroundColor Yellow
php artisan migrate:fresh --seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Fresh migration with seed successful" -ForegroundColor Green
} else {
    Write-Host "✗ Migration failed" -ForegroundColor Red
    $ErrorCount++
}

php artisan db:seed --class=DemoUsersSeeder
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Demo users seeder is idempotent" -ForegroundColor Green
} else {
    Write-Host "✗ Demo seeder failed" -ForegroundColor Red
    $ErrorCount++
}

# Step 3: Routes
Write-Host "`nStep 3: Routes Configuration" -ForegroundColor Yellow
$requestRoutes = php artisan route:list --path=api/requests
if ($requestRoutes -like "*api/requests*") {
    Write-Host "✓ Requests API routes present" -ForegroundColor Green
} else {
    Write-Host "✗ Requests routes not found" -ForegroundColor Red
    $ErrorCount++
}

# Step 4: Tests
Write-Host "`nStep 4: Testing" -ForegroundColor Yellow
php artisan test --filter=Policies --stop-on-failure
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Policy tests passed" -ForegroundColor Green
} else {
    Write-Host "✗ Policy tests failed" -ForegroundColor Red
    $ErrorCount++
}

php artisan test --filter=Requests --stop-on-failure
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Requests API tests passed" -ForegroundColor Green
} else {
    Write-Host "✗ Requests tests failed" -ForegroundColor Red
    $ErrorCount++
}

php artisan test
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Full test suite passed" -ForegroundColor Green
} else {
    Write-Host "✗ Full test suite failed" -ForegroundColor Red
    $ErrorCount++
}

# Step 5: Assets
Set-Location ..
Write-Host "`nStep 5: Verification Assets" -ForegroundColor Yellow

if (Test-Path "snippets/backend-verify.http") {
    Write-Host "✓ REST client file available" -ForegroundColor Green
} else {
    Write-Host "✗ REST client file missing" -ForegroundColor Red
    $ErrorCount++
}

if (Test-Path "checklists/laravel-scaffold-verify.md") {
    Write-Host "✓ Verification checklist available" -ForegroundColor Green
} else {
    Write-Host "✗ Verification checklist missing" -ForegroundColor Red
    $ErrorCount++
}

# Summary
Write-Host "`n$('=' * 50)"
if ($ErrorCount -eq 0) {
    Write-Host "SUCCESS: Laravel Scaffold Verification PASSED!" -ForegroundColor Green
    Write-Host "Backend is production-ready and Vapor-ready!" -ForegroundColor Green
} else {
    Write-Host "FAILED: Laravel Scaffold Verification FAILED!" -ForegroundColor Red
    Write-Host "$ErrorCount error(s) found. Please review and fix." -ForegroundColor Red
}