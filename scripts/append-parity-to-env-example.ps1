Param()
$path = "backend/.env.example"
if (-not (Test-Path $path)) { Write-Error "File not found: $path"; exit 1 }
$content = Get-Content -LiteralPath $path -Raw -ErrorAction Stop
if ($content -notmatch 'VAPOR_ARTISAN_OPTIMIZE') {
  Add-Content -LiteralPath $path -Value ""
  $block = @"
# --- Vapor parity (local defaults) ---
CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local
# Feature flags (no-op locally)
VAPOR_ARTISAN_OPTIMIZE=false
"@
  Add-Content -LiteralPath $path -Value $block -Encoding UTF8
  Write-Host "Parity block appended."
} else {
  Write-Host "Parity block already present."
}
