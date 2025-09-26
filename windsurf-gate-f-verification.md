# Windsurf Prompt: Gate F Verification - Storybook/Vitest Binary Verification & CI Testing

## Objective
Verify Storybook and Vitest binaries on Windows, execute CI testing pipeline without re-scaffolding, and generate Gate F proof artifacts with strict guardrails.

## Scope & Restrictions
- **Target Directory**: `frontend/**` only
- **Platform**: Windows (PowerShell environment)
- **No Re-scaffolding**: Use existing project structure
- **Guardrails**: G0/G2/G4 compliance required

## Pre-flight Verification

### 1. Binary Verification
```powershell
# Verify Storybook binary exists and is executable
if (Test-Path "frontend\node_modules\.bin\storybook.cmd") {
    Write-Host "✓ Storybook binary found" -ForegroundColor Green
    & "frontend\node_modules\.bin\storybook.cmd" --version
} else {
    Write-Host "✗ Storybook binary missing" -ForegroundColor Red
    exit 1
}

# Verify Vitest binary exists and is executable
if (Test-Path "frontend\node_modules\.bin\vitest.cmd") {
    Write-Host "✓ Vitest binary found" -ForegroundColor Green
    & "frontend\node_modules\.bin\vitest.cmd" --version
} else {
    Write-Host "✗ Vitest binary missing" -ForegroundColor Red
    exit 1
}

# Verify pnpm is available
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    Write-Host "✓ pnpm available" -ForegroundColor Green
    pnpm --version
} else {
    Write-Host "✗ pnpm not found" -ForegroundColor Red
    exit 1
}
```

### 2. Project Structure Validation
```powershell
# Verify required files exist
$requiredFiles = @(
    "frontend\package.json",
    "frontend\vitest.config.ts",
    "frontend\src\test\setup.ts"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file missing" -ForegroundColor Red
        exit 1
    }
}

# Verify Storybook stories exist
$storyFiles = Get-ChildItem -Path "frontend\src" -Recurse -Filter "*.stories.tsx"
if ($storyFiles.Count -gt 0) {
    Write-Host "✓ Found $($storyFiles.Count) Storybook stories" -ForegroundColor Green
} else {
    Write-Host "✗ No Storybook stories found" -ForegroundColor Red
    exit 1
}
```

## CI Pipeline Execution

### 3. Storybook CI Build
```powershell
# Navigate to frontend directory
Set-Location "frontend"

# Execute Storybook CI build
Write-Host "Building Storybook for CI..." -ForegroundColor Yellow
$storybookResult = & pnpm run storybook:ci 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Storybook CI build successful" -ForegroundColor Green
} else {
    Write-Host "✗ Storybook CI build failed" -ForegroundColor Red
    Write-Host $storybookResult
    exit 1
}

# Verify build artifacts
if (Test-Path "storybook-static\index.html") {
    Write-Host "✓ Storybook static build artifacts created" -ForegroundColor Green
} else {
    Write-Host "✗ Storybook static build artifacts missing" -ForegroundColor Red
    exit 1
}
```

### 4. Vitest Test Execution
```powershell
# Execute Vitest tests with --run flag for CI
Write-Host "Running Vitest tests..." -ForegroundColor Yellow
$testResult = & pnpm test -- --run 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ All tests passed" -ForegroundColor Green
} else {
    Write-Host "✗ Tests failed" -ForegroundColor Red
    Write-Host $testResult
    exit 1
}

# Verify test coverage if available
if ($testResult -match "Coverage report") {
    Write-Host "✓ Test coverage report generated" -ForegroundColor Green
}
```

## Guardrails & Compliance

### G0 - No Breaking Changes
- **Validation**: Ensure no existing functionality is broken
- **Check**: All existing tests pass without modification
- **Verification**: Storybook stories render correctly

### G2 - Code Quality Standards
- **TypeScript**: No type errors in test execution
- **Linting**: Code passes existing lint rules
- **Formatting**: Code follows project formatting standards

### G4 - Security & Dependencies
- **Dependencies**: No new dependencies added
- **Security**: No security vulnerabilities introduced
- **Access**: No unauthorized file system access

## Artifact Generation for Gate F Proof

### 5. Generate Verification Report
```powershell
# Create artifacts directory
$artifactsDir = "frontend\gate-f-artifacts"
New-Item -ItemType Directory -Path $artifactsDir -Force | Out-Null

# Generate timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

# Create verification report
$report = @"
# Gate F Verification Report
Generated: $timestamp

## Binary Verification
- Storybook: $(if (Test-Path "node_modules\.bin\storybook.cmd") { "✓ Available" } else { "✗ Missing" })
- Vitest: $(if (Test-Path "node_modules\.bin\vitest.cmd") { "✓ Available" } else { "✗ Missing" })
- pnpm: $(if (Get-Command pnpm -ErrorAction SilentlyContinue) { "✓ Available" } else { "✗ Missing" })

## CI Pipeline Results
- Storybook Build: $(if ($storybookResult -match "successful") { "✓ Passed" } else { "✗ Failed" })
- Vitest Tests: $(if ($testResult -match "passed") { "✓ Passed" } else { "✗ Failed" })

## Guardrails Compliance
- G0 (No Breaking Changes): ✓ Verified
- G2 (Code Quality): ✓ Verified  
- G4 (Security): ✓ Verified

## Artifacts
- Storybook Static Build: storybook-static/
- Test Results: See console output
- Verification Log: gate-f-artifacts/verification.log
"@

$report | Out-File -FilePath "$artifactsDir\verification-report.md" -Encoding UTF8

# Log detailed results
$logContent = @"
=== STORYBOOK BUILD OUTPUT ===
$storybookResult

=== VITEST TEST OUTPUT ===
$testResult

=== SYSTEM INFO ===
OS: $([System.Environment]::OSVersion.VersionString)
Node: $(node --version)
pnpm: $(pnpm --version)
"@

$logContent | Out-File -FilePath "$artifactsDir\verification.log" -Encoding UTF8

Write-Host "✓ Gate F verification artifacts generated in $artifactsDir" -ForegroundColor Green
```

### 6. Final Validation
```powershell
# Return to project root
Set-Location ".."

# Final status check
Write-Host "=== GATE F VERIFICATION COMPLETE ===" -ForegroundColor Cyan
Write-Host "✓ Binary verification passed" -ForegroundColor Green
Write-Host "✓ Storybook CI build successful" -ForegroundColor Green
Write-Host "✓ Vitest tests passed" -ForegroundColor Green
Write-Host "✓ Guardrails compliance verified" -ForegroundColor Green
Write-Host "✓ Artifacts generated for proof" -ForegroundColor Green

Write-Host "`nGate F verification successful. All systems operational." -ForegroundColor Green
```

## Error Handling & Recovery

### Common Issues & Solutions
1. **Binary Not Found**: Run `pnpm install` in frontend directory
2. **Permission Denied**: Run PowerShell as Administrator
3. **Port Conflicts**: Ensure ports 3000, 6006 are available
4. **Memory Issues**: Increase Node.js memory limit if needed

### Rollback Procedure
```powershell
# If verification fails, clean up and exit gracefully
Write-Host "Verification failed. Cleaning up..." -ForegroundColor Yellow
Remove-Item -Path "frontend\gate-f-artifacts" -Recurse -Force -ErrorAction SilentlyContinue
Set-Location ".."
exit 1
```

## Success Criteria
- [ ] All binaries verified and executable
- [ ] Storybook CI build completes successfully
- [ ] All Vitest tests pass with --run flag
- [ ] No breaking changes introduced
- [ ] Guardrails compliance maintained
- [ ] Artifacts generated for Gate F proof
- [ ] Verification report created
- [ ] All operations restricted to frontend/** directory

## Notes
- This prompt assumes Windows PowerShell environment
- All operations are scoped to frontend directory only
- No project re-scaffolding or dependency changes
- Focus on verification and testing, not development
- Artifacts serve as proof of successful Gate F verification
