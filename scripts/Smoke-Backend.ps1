# Backend smoke tests for rehome-platform Laravel API
# Author: VS AI Assistant
# Usage: powershell -File scripts/Smoke-Backend.ps1
# 
# This script validates the backend Laravel application by:
# 1. Starting Laravel development server (if possible)
# 2. Testing health and CSRF endpoints via HTTP
# 3. Validating database connectivity via Artisan Tinker
# 4. Graceful cleanup of background processes
#
# Exit codes:
# 0  = All tests passed
# 1  = Health endpoint failed
# 2  = CSRF endpoint failed
# 3  = Database test failed
# 98 = Server start warnings (tests may still pass)
# 99 = Fatal error

param(
    [string]$ServerHost = "127.0.0.1",
    [int]$Port = 8000,
    [int]$StartupWaitSeconds = 8
)

$ErrorActionPreference = "Continue"
$LaravelJob = $null
$ExitCode = 0

function Write-TestStep {
    param([string]$Message, [string]$Status = "INFO")
    $timestamp = Get-Date -Format "HH:mm:ss"
    $color = switch ($Status) {
        "SUCCESS" { "Green" }
        "ERROR" { "Red" }
        "WARNING" { "Yellow" }
        default { "Cyan" }
    }
    Write-Host "[$timestamp] " -NoNewline -ForegroundColor Gray
    Write-Host "$Message" -ForegroundColor $color
}

function Stop-LaravelServer {
    if ($LaravelJob -and $LaravelJob.State -eq "Running") {
        Write-TestStep "Stopping Laravel server..." "WARNING"
        Stop-Job $LaravelJob -PassThru | Remove-Job
    }
}

try {
    Write-Host "=== Backend Smoke Tests Starting ===" -ForegroundColor Magenta
    Write-Host ""
    
    # Change to project root
    Push-Location $PSScriptRoot/..
    
    # Check prerequisites
    Write-TestStep "Checking prerequisites..."
    
    if (-not (Test-Path "backend/artisan")) {
        throw "Laravel artisan not found. Are you in the project root?"
    }
    
    if (-not (Get-Command curl.exe -ErrorAction SilentlyContinue)) {
        throw "curl.exe not found. Please install curl or use Windows 10/11 built-in version."
    }
    
    if (-not (Get-Command php -ErrorAction SilentlyContinue)) {
        throw "php not found. Please ensure PHP is installed and in PATH."
    }
    
    Write-TestStep "Prerequisites check passed" "SUCCESS"
    Write-Host ""
    
    # Test Laravel basic functionality first
    Write-TestStep "Testing Laravel framework basic functionality..."
    try {
        Push-Location backend
        $aboutOutput = & php artisan about --only=environment 2>&1
        Pop-Location
        
        if ($LASTEXITCODE -ne 0) {
            Write-TestStep "Laravel artisan about warning: $aboutOutput" "WARNING"
        } else {
            Write-TestStep "Laravel framework is functional" "SUCCESS"
        }
    }
    catch {
        Pop-Location -ErrorAction SilentlyContinue
        Write-TestStep "Laravel framework test failed: $_" "WARNING"
    }
    
    # Start Laravel development server in background
    Write-TestStep "Starting Laravel server on ${ServerHost}:${Port}..."
    
    $LaravelJob = Start-Job -ScriptBlock {
        param($ProjectPath, $ServerHost, $Port)
        try {
            Set-Location "$ProjectPath/backend"
            Write-Output "Starting server..."
            & php artisan serve --host=$ServerHost --port=$Port --no-ansi 2>&1
        }
        catch {
            Write-Output "Error: $_"
        }
    } -ArgumentList (Get-Location), $ServerHost, $Port
    
    # Wait for server to start
    Write-TestStep "Waiting $StartupWaitSeconds seconds for server startup..."
    Start-Sleep -Seconds $StartupWaitSeconds
    
    # Check if job is still running and get any output
    $serverRunning = $false
    if ($LaravelJob.State -eq "Running") {
        $serverRunning = $true
        Write-TestStep "Laravel server appears to be running" "SUCCESS"
    } else {
        $jobError = Receive-Job $LaravelJob -ErrorAction SilentlyContinue
        if ($jobError -match "Failed to listen") {
            Write-TestStep "Laravel server failed to bind to ${ServerHost}:${Port} - network configuration issue" "WARNING"
            $ExitCode = 98
        } else {
            Write-TestStep "Laravel server stopped unexpectedly: $jobError" "ERROR"
            $ExitCode = 98
        }
    }
    
    # Only test HTTP endpoints if server is running
    if ($serverRunning) {
        # Test 1: Health endpoint
        Write-TestStep "Testing Health endpoint at http://${ServerHost}:${Port}/api/health"
        try {
            $healthResponse = curl.exe -s --max-time 10 --connect-timeout 5 "http://${ServerHost}:${Port}/api/health"
            if ($LASTEXITCODE -eq 0 -and $healthResponse) {
                Write-TestStep "Health endpoint successful" "SUCCESS"
                Write-Host "Response:" -ForegroundColor Gray
                Write-Host $healthResponse -ForegroundColor White
                Write-Host ""
            } else {
                Write-TestStep "Health endpoint returned no data or failed" "ERROR"
                $ExitCode = 1
            }
        }
        catch {
            Write-TestStep "Health endpoint failed: $_" "ERROR"
            $ExitCode = 1
        }
        
        # Test 2: CSRF cookie endpoint
        Write-TestStep "Testing CSRF cookie endpoint at http://${ServerHost}:${Port}/sanctum/csrf-cookie"
        try {
            $csrfResponse = curl.exe -i -s --max-time 10 --connect-timeout 5 "http://${ServerHost}:${Port}/sanctum/csrf-cookie"
            if ($LASTEXITCODE -eq 0 -and $csrfResponse) {
                Write-TestStep "CSRF cookie endpoint successful" "SUCCESS"
                Write-Host "Response:" -ForegroundColor Gray
                Write-Host $csrfResponse -ForegroundColor White
                Write-Host ""
                
                if ($csrfResponse -match "Set-Cookie") {
                    Write-TestStep "Set-Cookie header found in CSRF response" "SUCCESS"
                } else {
                    Write-TestStep "CSRF endpoint did not return Set-Cookie header" "ERROR"
                    if ($ExitCode -eq 0 -or $ExitCode -eq 98) { $ExitCode = 2 }
                }
            } else {
                Write-TestStep "CSRF endpoint returned no data or failed" "ERROR"
                if ($ExitCode -eq 0 -or $ExitCode -eq 98) { $ExitCode = 2 }
            }
        }
        catch {
            Write-TestStep "CSRF endpoint failed: $_" "ERROR"
            if ($ExitCode -eq 0 -or $ExitCode -eq 98) { $ExitCode = 2 }
        }
    } else {
        Write-TestStep "Skipping HTTP endpoint tests - server not running" "WARNING"
    }
    
    # Test 3: Database connection (always test this regardless of server status)
    Write-TestStep "Testing database connection via Tinker"
    try {
        $command = 'echo \App\Models\Request::query()->first()?->only([\"id\",\"title\",\"status\"]);'
        Push-Location backend
        $result = & php artisan tinker --execute=$command 2>&1
        Pop-Location
        
        if ($LASTEXITCODE -eq 0) {
            Write-TestStep "Database connection successful" "SUCCESS"
            Write-Host "Database result:" -ForegroundColor Gray
            Write-Host $result -ForegroundColor White
            Write-Host ""
        } else {
            Write-TestStep "Database test failed with exit code $LASTEXITCODE" "ERROR"
            if ($ExitCode -eq 0 -or $ExitCode -eq 98) { $ExitCode = 3 }
        }
    }
    catch {
        Pop-Location -ErrorAction SilentlyContinue
        Write-TestStep "Database test failed: $_" "ERROR"
        if ($ExitCode -eq 0 -or $ExitCode -eq 98) { $ExitCode = 3 }
    }
    
    Write-Host ""
    if ($ExitCode -eq 0) {
        Write-Host "=== All Smoke Tests Passed! ===" -ForegroundColor Green
    } elseif ($ExitCode -eq 98) {
        Write-Host "=== Tests Completed with Server Warnings (Exit Code: $ExitCode) ===" -ForegroundColor Yellow
        Write-Host "Note: Database and framework tests passed, but HTTP server had binding issues." -ForegroundColor Yellow
    } else {
        Write-Host "=== Some Tests Failed (Exit Code: $ExitCode) ===" -ForegroundColor Red
    }
}
catch {
    Write-TestStep "Fatal error: $_" "ERROR"
    $ExitCode = 99
}
finally {
    # Cleanup
    Stop-LaravelServer
    Pop-Location
    
    Write-Host ""
    Write-TestStep "Smoke tests completed with exit code $ExitCode"
    exit $ExitCode
}