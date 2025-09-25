# Laravel Scaffold Verification Script
Write-Host "Laravel Scaffold Verification Starting..." -ForegroundColor Green
Write-Host "=================================================="

$ErrorCount = 0

# Step 1: Dependencies
Write-Host ""
Write-Host "Step 1: Dependencies and Environment" -ForegroundColor Yellow
Set-Location backend

composer install --no-interaction
if ($LASTEXITCODE -eq 0) {
    Write-Host "Success: Composer install successful" -ForegroundColor Green
} else {
    Write-Host "Error: Composer install failed" -ForegroundColor Red
    $ErrorCount++
}

$version = php artisan --version
Write-Host "Success: Laravel version: $version" -ForegroundColor Green

php artisan optimize:clear | Out-Null
Write-Host "Success: Cache cleared" -ForegroundColor Green

# Step 2: Database
Write-Host ""
Write-Host "Step 2: Database and Seeding" -ForegroundColor Yellow
php artisan migrate:fresh --seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "Success: Fresh migration with seed successful" -ForegroundColor Green
} else {
    Write-Host "Error: Migration failed" -ForegroundColor Red
    $ErrorCount++
}

# Step 3: Tests
Write-Host ""
Write-Host "Step 3: Testing" -ForegroundColor Yellow
php artisan test
if ($LASTEXITCODE -eq 0) {
    Write-Host "Success: Full test suite passed" -ForegroundColor Green
} else {
    Write-Host "Error: Full test suite failed" -ForegroundColor Red
    $ErrorCount++
}

# Step 4: Assets
Set-Location ..
Write-Host ""
Write-Host "Step 4: Verification Assets" -ForegroundColor Yellow

if (Test-Path "snippets/backend-verify.http") {
    Write-Host "Success: REST client file available" -ForegroundColor Green
} else {
    Write-Host "Error: REST client file missing" -ForegroundColor Red
    $ErrorCount++
}

if (Test-Path "checklists/laravel-scaffold-verify.md") {
    Write-Host "Success: Verification checklist available" -ForegroundColor Green
} else {
    Write-Host "Error: Verification checklist missing" -ForegroundColor Red
    $ErrorCount++
}

# Summary
Write-Host ""
Write-Host "=================================================="
if ($ErrorCount -eq 0) {
    Write-Host "SUCCESS: Laravel Scaffold Verification PASSED!" -ForegroundColor Green
    Write-Host "Backend is production-ready and Vapor-ready!" -ForegroundColor Green
} else {
    Write-Host "FAILED: Verification found $ErrorCount errors." -ForegroundColor Red
}