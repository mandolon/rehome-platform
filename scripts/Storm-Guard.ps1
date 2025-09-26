<# Storm-Guard.ps1 — Windows PowerShell (Desktop) READ-ONLY Gate F helper
   Safe, ASCII-only version (avoids encoding/emoji parse errors)
   Behavior:
     - Prints "Storm READ-ONLY mode active."
     - Shows yellow dirty-tree warning if repo has changes (non-blocking)
     - Creates .gatef_artifacts at repo root
     - Runs (best-effort) in frontend/: typecheck, storybook:ci, vitest --run
     - Logs to: .gatef_artifacts\typecheck.log, storybook-ci.log, vitest.log
     - Writes tail lines to scripts\Storm-Guard.last.log
     - Always attempts to complete; returns 0 unless a hard failure happens
#>

[CmdletBinding()]
param(
  [switch]$WriteAllowed  # not used; kept for future parity
)

$ErrorActionPreference = "Continue"

function Write-Section([string]$msg) {
  Write-Host ""
  Write-Host "=== $msg ===" -ForegroundColor Cyan
}

function New-DirIfMissing([string]$path) {
  if (-not (Test-Path -LiteralPath $path)) {
    New-Item -ItemType Directory -Path $path -Force | Out-Null
  }
}

# Resolve repo root = parent of scripts\
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot  = Split-Path -Parent $ScriptDir
$Artifacts = Join-Path $RepoRoot ".gatef_artifacts"
$Frontend  = Join-Path $RepoRoot "frontend"
$LastLog   = Join-Path $ScriptDir "Storm-Guard.last.log"

Write-Section "Storm Guard"
Write-Host "Storm READ-ONLY mode active." -ForegroundColor Yellow
Write-Host ("Repo root: " + $RepoRoot) -ForegroundColor Green

# Dirty tree warning (non-blocking)
Write-Section "Git dirty-tree check"
$dirty = $false
try {
  $status = git status --porcelain=v1 2>$null
  if ($status) { $dirty = $true }
} catch {
  Write-Warning "git not found in PATH; skipping dirty-tree check."
}
if ($dirty) {
  Write-Warning "Dirty tree detected. Proceeding (non-blocking)."
} else {
  Write-Host "Working tree clean."
}

# Prepare artifacts directory
New-DirIfMissing $Artifacts

# Helper to run a pnpm command inside frontend and log output
function Run-FrontendTask {
  param(
    [string]$Title,
    [string[]]$Args,
    [string]$LogPath
  )
  Write-Section $Title
  if (-not (Test-Path -LiteralPath $Frontend)) {
    "frontend/ folder not found. Skipping task: $Title" | Tee-Object -FilePath $LogPath
    return
  }

  Push-Location $Frontend
  try {
    # Ensure logs start with a header
    ("[Start] {0} {1}" -f (Get-Date), ($Args -join " ")) | Out-File -FilePath $LogPath -Encoding UTF8

    # Attempt install if node_modules missing (best effort, non-blocking)
    if (-not (Test-Path -LiteralPath (Join-Path $Frontend "node_modules"))) {
      "node_modules missing; attempting 'pnpm install' (best effort)..." | Tee-Object -FilePath $LogPath -Append
      try {
        pnpm install *>&1 | Tee-Object -FilePath $LogPath -Append
      } catch {
        "pnpm install failed (non-blocking): $($_.Exception.Message)" | Tee-Object -FilePath $LogPath -Append
      }
    }

    # Run the actual task
    pnpm @Args *>&1 | Tee-Object -FilePath $LogPath -Append
    ("[End] {0}" -f (Get-Date)) | Tee-Object -FilePath $LogPath -Append
  } catch {
    ("ERROR: {0}" -f $_.Exception.Message) | Tee-Object -FilePath $LogPath -Append
  } finally {
    Pop-Location
  }
}

# Run tasks (best effort)
$typeLog = Join-Path $Artifacts "typecheck.log"
$sbLog   = Join-Path $Artifacts "storybook-ci.log"
$vtLog   = Join-Path $Artifacts "vitest.log"

Run-FrontendTask -Title "Typecheck"   -Args @("run","-s","typecheck")        -LogPath $typeLog
Run-FrontendTask -Title "Storybook CI" -Args @("run","-s","storybook:ci")     -LogPath $sbLog
Run-FrontendTask -Title "Vitest"       -Args @("run","-s","test","--","--run") -LogPath $vtLog

# Summarize to last log
try {
  $summary = @()
  $summary += "Storm Guard summary"
  $summary += ("Repo root: {0}" -f $RepoRoot)
  $summary += ("Dirty tree: {0}" -f ($dirty ? "yes" : "no"))
  $summary += ""
  $summary += "--- typecheck.log (tail 10) ---"
  if (Test-Path -LiteralPath $typeLog) { $summary += (Get-Content $typeLog -Tail 10) } else { $summary += "(missing)" }
  $summary += ""
  $summary += "--- storybook-ci.log (tail 10) ---"
  if (Test-Path -LiteralPath $sbLog)   { $summary += (Get-Content $sbLog -Tail 10) }   else { $summary += "(missing)" }
  $summary += ""
  $summary += "--- vitest.log (tail 10) ---"
  if (Test-Path -LiteralPath $vtLog)   { $summary += (Get-Content $vtLog -Tail 10) }   else { $summary += "(missing)" }
  $summary += ""
  $summary += "Storm guard run complete."

  $summary | Set-Content -LiteralPath $LastLog -Encoding UTF8
} catch {
  Write-Warning ("Failed to write last log: {0}" -f $_.Exception.Message)
}

Write-Host ""
Write-Host "OK: Storm guard run complete." -ForegroundColor Green
exit 0

