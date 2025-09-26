# Gate F verification for Storybook + Vitest on Windows
# Run from: frontend/
$ErrorActionPreference = "Stop"
function Write-Header($msg){ Write-Host "=== $msg ===" -ForegroundColor Cyan }
$ts = Get-Date -Format "yyyyMMdd_HHmmss"
$ArtifactsDir = ".gatef_artifacts\$ts"
New-Item -ItemType Directory -Force -Path $ArtifactsDir | Out-Null

Write-Header "Environment"
$nodeV = node -v
$pnpmV = pnpm -v
"Node: $nodeV" | Tee-Object -FilePath "$ArtifactsDir\env.txt"
"pnpm: $pnpmV" | Tee-Object -FilePath "$ArtifactsDir\env.txt" -Append

Write-Header "Project structure and scripts"
Get-ChildItem -Name .storybook, package.json, vitest.config.* | Tee-Object -FilePath "$ArtifactsDir\structure.txt"
(Get-Content package.json) | Out-File -FilePath "$ArtifactsDir\package.json.snapshot" -Encoding UTF8

Write-Header "Installing dependencies"
$installLog = Join-Path $ArtifactsDir "install.log"
try { pnpm install --frozen-lockfile *>$installLog 2>&1 } catch { pnpm install --no-frozen-lockfile *>$installLog 2>&1 }
"Install log saved: $installLog" | Write-Host

Write-Header "Verifying binaries"
$binReport = Join-Path $ArtifactsDir "binaries.txt"
$storybookBin = Join-Path "." "node_modules\.bin\storybook.cmd"
$vitestBin    = Join-Path "." "node_modules\.bin\vitest.cmd"
"Local Storybook bin exists: $([IO.File]::Exists($storybookBin)) -> $storybookBin" | Tee-Object -FilePath $binReport
"Local Vitest bin exists: $([IO.File]::Exists($vitestBin)) -> $vitestBin" | Tee-Object -FilePath $binReport -Append
$dlxReport = Join-Path $ArtifactsDir "dlx.txt"
try { pnpm dlx storybook@8.6.14 --version *>$dlxReport 2>&1; "pnpm dlx storybook OK" | Tee-Object -FilePath $binReport -Append } catch { "pnpm dlx storybook FAILED" | Tee-Object -FilePath $binReport -Append }
try { pnpm dlx vitest@3.2.4 --version *>>$dlxReport 2>&1; "pnpm dlx vitest OK" | Tee-Object -FilePath $binReport -Append } catch { "pnpm dlx vitest FAILED" | Tee-Object -FilePath $binReport -Append }

Write-Header "Storybook CI build"
$sbLog = Join-Path $ArtifactsDir "storybook-build.log"
$sbExit = 0
try { pnpm run -s storybook:ci *>$sbLog 2>&1 } catch {
  try { pnpm dlx storybook@8.6.14 build -c .storybook --output-dir storybook-static *>$sbLog 2>&1 } catch { $sbExit = 1 }
}
if ($sbExit -eq 0) { "Storybook build: SUCCESS" | Tee-Object -FilePath "$ArtifactsDir\summary.txt" } else { "Storybook build: FAILURE" | Tee-Object -FilePath "$ArtifactsDir\summary.txt" }

Write-Header "Vitest a11y smoke tests"
$vitestLog = Join-Path $ArtifactsDir "vitest.log"
$vtExit = 0
try { pnpm run -s test -- --run *>$vitestLog 2>&1 } catch {
  try { pnpm dlx vitest@3.2.4 --run *>$vitestLog 2>&1 } catch { $vtExit = 1 }
}
if ($vtExit -eq 0) { "Vitest a11y tests: SUCCESS" | Tee-Object -FilePath "$ArtifactsDir\summary.txt" -Append } else { "Vitest a11y tests: FAILURE" | Tee-Object -FilePath "$ArtifactsDir\summary.txt" -Append }

Write-Header "Gate F proof"
$proof = Join-Path $ArtifactsDir "GateFProof.md"
$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
@"
# Gate F Verification Proof

- Timestamp: $now
- Node: $nodeV
- pnpm: $pnpmV

## Results
- Storybook build: $([IO.File]::ReadAllText("$ArtifactsDir\summary.txt") -match "Storybook build: SUCCESS")
- Vitest a11y tests: $([IO.File]::ReadAllText("$ArtifactsDir\summary.txt") -match "Vitest a11y tests: SUCCESS")

## Artifacts
- env.txt
- structure.txt
- package.json.snapshot
- install.log
- binaries.txt
- dlx.txt
- storybook-build.log
- vitest.log
- summary.txt

All files under: $ArtifactsDir
"@ | Out-File -FilePath $proof -Encoding UTF8

Write-Header "Done"
"Artifacts directory: $ArtifactsDir" | Write-Host -ForegroundColor Green
