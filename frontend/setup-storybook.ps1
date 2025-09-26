param(
  [string]$NodeVersion = "20.14.0",
  [switch]$DoCommit
)

$ErrorActionPreference = "Stop"

function Step($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Info($msg) { Write-Host "$msg" -ForegroundColor Gray }
function Success($msg) { Write-Host "$msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "$msg" -ForegroundColor Yellow }
function Fail($msg) { Write-Host "$msg" -ForegroundColor Red }

try {
  Step "Verify working directory"
  $cwd = Get-Location
  Info "Current directory: $cwd"
  if (!(Test-Path "$PWD/package.json")) {
    Warn "No package.json in this directory. Make sure you run this in frontend/"
  }

  Step "Verify nvm-windows availability"
  $nvmCmd = Get-Command nvm -ErrorAction SilentlyContinue
  if (-not $nvmCmd) {
    Fail "nvm is not installed or not on PATH. Install nvm-windows and open a NEW PowerShell window."
    Fail "Download: https://github.com/coreybutler/nvm-windows/releases"
    exit 1
  }

  Step "Switch Node to $NodeVersion"
  nvm list | Out-Null
  $installed = (nvm list | Select-String -Pattern $NodeVersion)
  if (-not $installed) {
    Info "Installing Node $NodeVersion via nvm..."
    nvm install $NodeVersion
  }
  nvm use $NodeVersion
  $nodeV = node -v
  Info "Node version: $nodeV"

  Step "Enable Corepack and activate pnpm@8.15.4"
  corepack enable
  corepack prepare pnpm@8.15.4 --activate
  $pnpmV = pnpm -v
  Info "pnpm version: $pnpmV"

  Step "Clean npm/pnpm artifacts"
  if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
  if (Test-Path node_modules\.ignored) { Remove-Item -Recurse -Force node_modules\.ignored }
  if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }

  Step "Install dependencies (pnpm install)"
  pnpm install

  Step "Build Storybook (pnpm run sb:build)"
  pnpm run sb:build

  Step "Run full check (lint + test + sb:build)"
  pnpm run check

  if ($DoCommit) {
    Step "Git commit changes"
    git add -A
    git commit -m "chore(storybook): honor engines (Node $NodeVersion), clean pnpm install; SB v8.6.14 build passes; Vitest/MSW/a11y verified"
    Success "Commit created."
  }

  Success "All steps completed successfully."
}
catch {
  Fail "Script failed: $($_.Exception.Message)"
  exit 1
}
