Param()
$errors = @()
$files = @("vapor.yml","backend/.env.vapor.staging","backend/.env.vapor.production","infra/vapor/README.md")
foreach ($f in $files) { if (-not (Test-Path $f)) { $errors += $f } }
if ($errors.Count -gt 0) { Write-Error ("Missing files: " + ($errors -join ", ")); exit 1 }
Write-Host "Vapor readiness files present." -ForegroundColor Green
