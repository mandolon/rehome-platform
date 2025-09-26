Param(
  [switch]$NoFrontend
)
$ErrorActionPreference = "Stop"
Write-Host "=== DIY Verify: Backend ===" -ForegroundColor Cyan
Push-Location backend
if (Test-Path ".env" -PathType Leaf -ErrorAction SilentlyContinue) { }
else {
  if (Test-Path ".env.example") { Copy-Item .env.example .env -Force }
  if (-not (Get-Content .env | Select-String -Quiet "^DB_CONNECTION=")) {
    Add-Content .env "DB_CONNECTION=sqlite"
  }
  New-Item -ItemType Directory -Force -Path "database" | Out-Null
  New-Item -ItemType File -Force -Path "database/database.sqlite" | Out-Null
}
if (-not (Test-Path "vendor")) { composer install --no-interaction --prefer-dist }
php artisan key:generate --force | Out-Null
php artisan migrate:fresh --seed -n
php artisan test
Pop-Location

if (-not $NoFrontend) {
  Write-Host "=== DIY Verify: Frontend ===" -ForegroundColor Cyan
  Push-Location frontend
  if (-not (Test-Path "node_modules")) {
    npm ci
    if ($LASTEXITCODE -ne 0) { npm install }
  }
  npm run test -- --run
  Pop-Location
}

Write-Host "✅ DIY Verify complete." -ForegroundColor Green
