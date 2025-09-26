Param()
$path = "backend/composer.json"
if (-not (Test-Path $path)) { Write-Error "composer.json not found at $path"; exit 1 }
$json = Get-Content -LiteralPath $path -Raw | ConvertFrom-Json
if (-not $json.scripts) { $json | Add-Member -NotePropertyName scripts -NotePropertyValue (@{}) }
# test
$json.scripts.test = @('@php -d detect_unicode=0 artisan test')
# lint/fix/stan
$json.scripts.lint = @('vendor/bin/pint --test')
$json.scripts.fix  = @('vendor/bin/pint')
$json.scripts.stan = @('vendor/bin/phpstan analyse --no-progress')
($json | ConvertTo-Json -Depth 10) | Set-Content -LiteralPath $path -Encoding UTF8
Write-Host "Updated composer scripts."
