<#  frontend/setup-storybook.ps1
    One-shot helper to:
      - Switch Node to a pinned version with nvm-windows
      - Enable Corepack & activate pnpm
      - Clean npm artifacts
      - pnpm install, Storybook build, full check
      - Optionally commit on success

    Usage (PowerShell, NEW window after installing nvm-windows):
      Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
      ./setup-storybook.ps1 -NodeVersion 20.14.0 -DoCommit

    Params:
      -NodeVersion  : Node version to use via nvm (default 20.14.0)
      -DoCommit     : If set, will git commit on success

#>

param(
  [string]$NodeVersion = "20.14.0",
  [switch]$DoCommit
)

# --- Utilities ---------------------------------------------------------------
$ErrorActionPreference = "Stop"

function Write-Info($msg)  { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Ok($msg)    { Write-Host "[OK]   $msg" -ForegroundColor Green }
function Write-Warn($msg)  { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Fail($msg)  { Write-Host "[FAIL] $msg" -ForegroundColor Red }

function TryExec {
  param(
    [Parameter(Mandatory=$true)][string]$Command,
    [string]$WorkingDir = $null
  )
  if ($WorkingDir) { Push-Location $WorkingDir }
  Write-Info "$Command"
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName  = "powershell"
  $psi.Arguments = "-NoLogo -NoProfile -ExecutionPolicy Bypass -Command `"& { $Command }` ""
  $psi.RedirectStandardError = $true
  $psi.RedirectStandardOutput = $true
  $psi.UseShellExecute = $false
  $p = New-Object System.Diagnostics.Process
  $p.StartInfo = $psi
  [void]$p.Start()
  $stdout = $p.StandardOutput.ReadToEnd()
  $stderr = $p.StandardError.ReadToEnd()
  $p.WaitForExit()
  if ($stdout.Trim().Length) { Write-Host $stdout }
  if ($p.ExitCode -ne 0) {
    if ($stderr.Trim().Length) { Write-Fail $stderr } else { Write-Fail "Command failed with exit code $($p.ExitCode)" }
    if ($WorkingDir) { Pop-Location }
    throw "Command failed: $Command"
  }
  if ($WorkingDir) { Pop-Location }
}

# --- Ensure we run from the script's directory (frontend/) -------------------
try {
  Set-Location -Path $PSScriptRoot
  Write-Ok "Working directory: $PWD"
} catch {
  Write-Fail "Could not set working directory to script location. $_"
  exit 1
}

# --- Pre-flight checks -------------------------------------------------------
if (-not (Get-Command nvm -ErrorAction SilentlyContinue)) {
  Write-Fail "nvm not found on PATH. Install nvm-windows and open a NEW PowerShell window."
  Write-Host "Get installer: https://github.com/coreybutler/nvm-windows/releases"
  exit 1
}
Write-Ok "nvm detected."

# --- Switch Node via nvm -----------------------------------------------------
try {
  $list = (nvm list) 2>$null
  if ($list -notmatch [Regex]::Escape($NodeVersion)) {
    Write-Info "Installing Node $NodeVersion via nvm..."
    TryExec -Command "nvm install $NodeVersion"
  }
  TryExec -Command "nvm use $NodeVersion"
  $nodeVer = (node -v).Trim()
  Write-Ok "Using Node $nodeVer"
} catch {
  Write-Fail "Failed to switch Node with nvm. $_"
  exit 1
}

# --- Enable Corepack & pnpm --------------------------------------------------
try {
  TryExec -Command "corepack enable"
  # Pin a known-good pnpm for SB v8 + Vitest (adjust if your repo pins differently)
  $pnpmVersion = "8.15.4"
  TryExec -Command "corepack prepare pnpm@$pnpmVersion --activate"
  $pnpmVer = (pnpm -v).Trim()
  Write-Ok "pnpm active: $pnpmVer"
} catch {
  Write-Fail "Failed to enable Corepack/pnpm. $_"
  exit 1
}

# --- Clean prior npm artifacts -----------------------------------------------
try {
  if (Test-Path node_modules) {
    Write-Warn "Removing node_modules..."
    Remove-Item -Recurse -Force node_modules
  }
  if (Test-Path "node_modules\.ignored") {
    Write-Warn "Removing node_modules\.ignored..."
    Remove-Item -Recurse -Force "node_modules\.ignored"
  }
  if (Test-Path package-lock.json) {
    Write-Warn "Removing package-lock.json..."
    Remove-Item -Force package-lock.json
  }
  Write-Ok "Cleaned previous install artifacts."
} catch {
  Write-Fail "Cleanup failed. $_"
  exit 1
}

# --- Install deps, build Storybook, run checks --------------------------------
try {
  TryExec -Command "pnpm install"
  TryExec -Command "pnpm run sb:build"
  TryExec -Command "pnpm run check"
  Write-Ok "Install, Storybook build, and checks completed successfully."
} catch {
  Write-Fail "Build/checks failed. $_"
  exit 1
}

# --- Optional commit ----------------------------------------------------------
if ($DoCommit.IsPresent) {
  try {
    # Detect repo root (one level up if script is in frontend/)
    $repoRoot = Resolve-Path "$PSScriptRoot\.."
    # Stage from repo root to include lockfiles and Storybook output if needed
    TryExec -Command "git add -A" -WorkingDir $repoRoot
    # Only commit if there are staged changes
    $status = (git status --porcelain) 2>$null
    if ([string]::IsNullOrWhiteSpace($status)) {
      Write-Info "No changes to commit."
    } else {
      $msg = 'chore(storybook): honor engines (Node 20.x), clean pnpm install; SB v8.6.14 build passes; Vitest/MSW/a11y verified'
      TryExec -Command "git commit -m `"$msg` "" -WorkingDir $repoRoot
      Write-Ok "Committed: $msg"
    }
  } catch {
    Write-Fail "Commit step failed. $_"
    exit 1
  }
} else {
  Write-Info "Skipping commit (use -DoCommit to auto-commit on success)."
}

Write-Ok "All done ✅"
exit 0
