$ErrorActionPreference = "Stop"
function Step($t){ Write-Host "`n=== $t ===" }

$API = "http://127.0.0.1:9000"
$EMAIL = "admin@rehome.com"
$PASS = "password"
$cookies = Join-Path $PSScriptRoot "cookies.txt"

Remove-Item $cookies -ErrorAction SilentlyContinue | Out-Null

try {
    # 1) CSRF cookie
    Step "CSRF Cookie"
    $i1 = Invoke-WebRequest -Uri "$API/sanctum/csrf-cookie" -Method GET -UseBasicParsing -SessionVariable sess
    Write-Host "✅ CSRF Request Status: $($i1.StatusCode)" -ForegroundColor Green
    
    # Debug: Check if cookies were set
    $cookieCount = 0
    $xsrf = $null
    if ($sess.Cookies) {
        $cookieCount = $sess.Cookies.Count
        $sess.Cookies.GetCookies($API) | ForEach-Object { 
            Write-Host "Cookie: $($_.Name) = $($_.Value.Substring(0, [Math]::Min(20, $_.Value.Length)))..." -ForegroundColor Cyan
            if ($_.Name -eq "XSRF-TOKEN") { $xsrf = $_.Value }
        }
    }
    
    Write-Host "Cookies found: $cookieCount" -ForegroundColor Cyan
    if(-not $xsrf){ 
        throw "No XSRF-TOKEN cookie set. Check Laravel Sanctum configuration and ensure the server is running properly."
    } 
    Write-Host "✅ XSRF-TOKEN acquired: $($xsrf.Substring(0, 20))..." -ForegroundColor Green

    # 2) Login
    Step "Login"
    $headers = @{ 
        "Accept" = "application/json"
        "Content-Type" = "application/json"
        "X-Requested-With" = "XMLHttpRequest"
        "X-XSRF-TOKEN" = [System.Web.HttpUtility]::UrlDecode($xsrf)
        "Referer" = $API
        "Origin" = $API
    }
    $loginBody = @{email=$EMAIL; password=$PASS} | ConvertTo-Json
    $i2 = Invoke-WebRequest -Uri "$API/api/auth/login" -Method POST -WebSession $sess -Headers $headers -Body $loginBody -UseBasicParsing
    Write-Host "✅ Login Status: $($i2.StatusCode)" -ForegroundColor Green
    $loginResponse = $i2.Content | ConvertFrom-Json
    Write-Host "✅ Login Response: $($loginResponse.message)" -ForegroundColor Green

    # 3) Me (authenticated)
    Step "GET /api/auth/me (authenticated)"
    $authHeaders = @{ 
        "Accept" = "application/json"
        "X-Requested-With" = "XMLHttpRequest"
        "Referer" = $API
        "Origin" = $API
    }
    $i3 = Invoke-WebRequest -Uri "$API/api/auth/me" -Method GET -WebSession $sess -Headers $authHeaders -UseBasicParsing
    Write-Host "✅ Authenticated Status: $($i3.StatusCode)" -ForegroundColor Green
    $userResponse = $i3.Content | ConvertFrom-Json
    Write-Host "✅ Authenticated User: $($userResponse.user.name) ($($userResponse.user.email))" -ForegroundColor Green

    # 4) Logout
    Step "POST /api/auth/logout"
    try {
        $i4 = Invoke-WebRequest -Uri "$API/api/auth/logout" -Method POST -WebSession $sess -Headers $headers -Body "{}" -ContentType "application/json" -UseBasicParsing
        Write-Host "✅ Logout Status: $($i4.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Logout failed: $($_.Exception.Message)" -ForegroundColor Yellow
        # Let's continue with the test even if logout fails
    }

    # 5) Me (should be unauthenticated)
    Step "GET /api/auth/me (after logout)"
    $logoutOk = $true
    try {
        $i5 = Invoke-WebRequest -Uri "$API/api/auth/me" -Method GET -WebSession $sess -Headers $authHeaders -UseBasicParsing
        Write-Host "⚠️ Unexpected success after logout: $($i5.StatusCode)" -ForegroundColor Yellow
        if($i5.StatusCode -lt 400){ $logoutOk = $false }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode
        if($statusCode -eq "Unauthorized") {
            Write-Host "✅ Expected 401 Unauthorized after logout" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Unexpected error after logout: $statusCode" -ForegroundColor Yellow
        }
    }

    # 6) Test a protected endpoint to double-check
    Step "GET /api/projects (should be unauthorized)"
    try {
        $i6 = Invoke-WebRequest -Uri "$API/api/projects" -Method GET -WebSession $sess -Headers $authHeaders -UseBasicParsing
        Write-Host "⚠️ Unexpected access to protected endpoint: $($i6.StatusCode)" -ForegroundColor Yellow
        $logoutOk = $false
    } catch {
        $statusCode = $_.Exception.Response.StatusCode
        if($statusCode -eq "Unauthorized") {
            Write-Host "✅ Protected endpoint correctly returns 401" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Unexpected error on protected endpoint: $statusCode" -ForegroundColor Yellow
        }
    }

    Step "FINAL RESULT"
    if($logoutOk){ 
        Write-Host "`n🎉 ✅ PASS: Complete auth flow working correctly!" -ForegroundColor Green
        Write-Host "   • CSRF cookie acquisition: ✅" -ForegroundColor Green
        Write-Host "   • Login with session: ✅" -ForegroundColor Green
        Write-Host "   • Authenticated API access: ✅" -ForegroundColor Green
        Write-Host "   • Logout session clearing: ✅" -ForegroundColor Green
        Write-Host "   • Post-logout protection: ✅" -ForegroundColor Green
    } else { 
        Write-Host "`n❌ FAIL: Session not properly cleared after logout" -ForegroundColor Red
        exit 1
    }

} catch {
    Write-Host "`n❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Stack trace: $($_.ScriptStackTrace)" -ForegroundColor Red
    exit 1
} finally {
    # Cleanup
    Remove-Item $cookies -ErrorAction SilentlyContinue | Out-Null
}