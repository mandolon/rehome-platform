# Reset-NodePnpm.ps1
# Fixes Node/pnpm/Corepack tangles on Windows with nvm-windows

Write-Host "DevBox Reset: Node/pnpm/Corepack (Windows, nvm-windows)" -ForegroundColor Cyan
Write-Host ""

# Step 1: Show current state
Write-Host "Current State:" -ForegroundColor Yellow
Write-Host "Node version:" -NoNewline
try { node --version } catch { Write-Host " (not found)" -ForegroundColor Red }
Write-Host "pnpm version:" -NoNewline  
try { pnpm --version } catch { Write-Host " (not found)" -ForegroundColor Red }
Write-Host ""

# Step 2: Reset Corepack
Write-Host "Resetting Corepack..." -ForegroundColor Yellow
try {
    corepack disable
    corepack enable
    Write-Host "Corepack reset complete" -ForegroundColor Green
} catch {
    Write-Host "Corepack reset failed: $_" -ForegroundColor Red
}

# Step 3: Prepare pnpm via Corepack
Write-Host "Preparing pnpm@8.15.4 via Corepack..." -ForegroundColor Yellow
try {
    corepack prepare pnpm@8.15.4 --activate
    Write-Host "pnpm prepared successfully" -ForegroundColor Green
} catch {
    Write-Host "pnpm preparation failed: $_" -ForegroundColor Red
}

# Step 4: Verify final state
Write-Host ""
Write-Host "Final State:" -ForegroundColor Yellow
Write-Host "Node version: $(node --version)"
Write-Host "pnpm version: $(pnpm --version)"
Write-Host "pnpm location: $(Get-Command pnpm | Select-Object -ExpandProperty Source)"

Write-Host ""
Write-Host "DevBox reset complete!" -ForegroundColor Green
Write-Host "If issues persist, check Windows PATH and restart terminal." -ForegroundColor Gray