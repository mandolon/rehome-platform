# scripts/Storm-Guard.ps1
# Default: READ-ONLY. Set $env:STORM_ALLOW_WRITE=1 to permit writes.
param(
  [switch]$WriteAllowed = $false
)

$ErrorActionPreference = 'Stop'
# Resolve repository root based on the script location so it works from any CWD
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $scriptDir

function Assert-CleanTree {
  $status = git status --porcelain=v1
  if ($status) {
    Write-Host "⚠️ Dirty working tree (continuing in read-only mode):" -ForegroundColor Yellow
    $status | Write-Host
    # Note: Do not block read-only proofs if the tree is dirty; we are not writing.
  }
}

function Tripwire-BlockWrites {
  if (!$env:STORM_ALLOW_WRITE -and -not $WriteAllowed) {
    Write-Host "🔒 Storm READ-ONLY mode active." -ForegroundColor Cyan
    Assert-CleanTree
    return $false
  }
  Write-Host "✍️ Storm WRITE mode enabled." -ForegroundColor Green
  return $true
}

cd "$root/frontend"

$canWrite = Tripwire-BlockWrites

# Always safe proofs (no writes)
if (-not (Get-Command nvm -ErrorAction SilentlyContinue)) { throw "nvm not on PATH." }
nvm use 20.14.0 | Out-Null
try { corepack --version | Out-Null } catch { npm i -g corepack | Out-Null }
corepack enable
corepack prepare pnpm@8.15.4 --activate
Write-Host "Node: $(node -v)  pnpm: $(pnpm -v)"

if ($canWrite) {
  if (Test-Path package-lock.json) { Remove-Item package-lock.json -Force }
  if (Test-Path node_modules) { Remove-Item node_modules -Recurse -Force }
  $pnpmStore = (& pnpm store path); if ($LASTEXITCODE -eq 0 -and (Test-Path $pnpmStore)) { Remove-Item $pnpmStore -Recurse -Force }
  pnpm install --no-frozen-lockfile
} else {
  Write-Host "⛔ Skipping any write operations (install/clean/save)."
}

Write-Host "== Proof: typecheck =="; pnpm -s typecheck
Write-Host "== Proof: storybook:ci =="; pnpm -s storybook:ci
Write-Host "== Proof: tests =="; pnpm -s test -- --run

Write-Host "✅ Storm guard run complete."