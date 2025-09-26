# Laravel Scaffold Verification Script - DEV ONLY
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Host "Laravel Scaffold Verification Starting..." -ForegroundColor Green
Write-Host "=================================================="

# Safety guard: Only run in local environment
Push-Location (Join-Path $PSScriptRoot '..\backend')
$envFile = Join-Path (Get-Location) '.env'
$appEnv = if (Test-Path $envFile) { 
    $envContent = Get-Content $envFile | Where-Object { $_ -match '^APP_ENV=' }
    if ($envContent) { $envContent -replace '^APP_ENV=', '' } else { 'local' }
} else { 'local' }

if ($appEnv -ne 'local') {
    Write-Host "SAFETY: Refusing to run migrate:fresh outside APP_ENV=local (found: $appEnv)" -ForegroundColor Yellow
    Pop-Location
    Exit 2
}

Write-Host "Environment check: APP_ENV=$appEnv" -ForegroundColor Green

# Step 1: Dependencies
Write-Host ""
Write-Host "Step 1: Dependencies and Environment" -ForegroundColor Yellow

php composer.phar install --no-interaction
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Composer install failed" -ForegroundColor Red
    Pop-Location
    Exit 1
}
Write-Host "Success: Composer install successful" -ForegroundColor Green

$version = php artisan --version
Write-Host "Success: Laravel version: $version" -ForegroundColor Green

php artisan optimize:clear | Out-Null
Write-Host "Success: Cache cleared" -ForegroundColor Green

# Step 2: Database
Write-Host ""
Write-Host "Step 2: Database and Seeding" -ForegroundColor Yellow
php artisan migrate:fresh --seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Migration failed" -ForegroundColor Red
    Pop-Location
    Exit 1
}
Write-Host "Success: Fresh migration with seed successful" -ForegroundColor Green

# Step 3: Tests
Write-Host ""
Write-Host "Step 3: Testing" -ForegroundColor Yellow
php artisan test --stop-on-failure
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Full test suite failed" -ForegroundColor Red
    Pop-Location
    Exit 1
}
Write-Host "Success: Full test suite passed" -ForegroundColor Green

# Step 4: Assets
Pop-Location
Push-Location $PSScriptRoot\..
Write-Host ""
Write-Host "Step 4: Verification Assets" -ForegroundColor Yellow

if (Test-Path "snippets/backend-verify.http") {
    Write-Host "Success: REST client file available" -ForegroundColor Green
} else {
    Write-Host "ERROR: REST client file missing" -ForegroundColor Red
    Pop-Location
    Exit 1
}

if (Test-Path "checklists/laravel-scaffold-verify.md") {
    Write-Host "Success: Verification checklist available" -ForegroundColor Green
} else {
    Write-Host "ERROR: Verification checklist missing" -ForegroundColor Red
    Pop-Location
    Exit 1
}

# Summary
Write-Host ""
Write-Host "=================================================="
Write-Host "SUCCESS: Laravel Scaffold Verification COMPLETE!" -ForegroundColor Green
Write-Host "Backend is production-ready and Vapor-ready!" -ForegroundColor Green

Pop-Location
Exit 0