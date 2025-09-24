# Test script for CSRF-aware API client
# This script tests the login flow with proper CSRF handling

Write-Host "🧪 Testing CSRF-Aware API Client..." -ForegroundColor Cyan

try {
    # Step 1: Get CSRF token
    Write-Host "`n1️⃣ Getting CSRF token..." -ForegroundColor Yellow
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $csrfResponse = Invoke-WebRequest -Uri "http://localhost:9000/sanctum/csrf-cookie" -WebSession $session
    Write-Host "✅ CSRF token obtained (Status: $($csrfResponse.StatusCode))" -ForegroundColor Green
    
    # Step 2: Extract XSRF token
    $xsrfToken = $session.Cookies.GetCookies("http://localhost:9000") | Where-Object {$_.Name -eq "XSRF-TOKEN"}
    if ($xsrfToken) {
        Write-Host "✅ XSRF token extracted: $($xsrfToken.Value.Substring(0,20))..." -ForegroundColor Green
    } else {
        Write-Host "❌ No XSRF token found in cookies" -ForegroundColor Red
        exit 1
    }
    
    # Step 3: Test login with CSRF token
    Write-Host "`n2️⃣ Testing login with CSRF token..." -ForegroundColor Yellow
    $loginBody = @{
        email = "admin@rehome.com"
        password = "password"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:9000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -Headers @{
        "Origin" = "http://localhost:3000"
        "Referer" = "http://localhost:3000"
        "X-XSRF-TOKEN" = $xsrfToken.Value
    } -WebSession $session
    
    Write-Host "✅ Login successful (Status: $($loginResponse.StatusCode))" -ForegroundColor Green
    $loginData = $loginResponse.Content | ConvertFrom-Json
    Write-Host "✅ User: $($loginData.data.name) ($($loginData.data.email))" -ForegroundColor Green
    
    # Step 4: Test /me endpoint
    Write-Host "`n3️⃣ Testing /me endpoint..." -ForegroundColor Yellow
    $meResponse = Invoke-WebRequest -Uri "http://localhost:9000/api/auth/me" -WebSession $session
    Write-Host "✅ /me endpoint successful (Status: $($meResponse.StatusCode))" -ForegroundColor Green
    $meData = $meResponse.Content | ConvertFrom-Json
    Write-Host "✅ Current user: $($meData.data.name)" -ForegroundColor Green
    
    # Step 5: Test logout
    Write-Host "`n4️⃣ Testing logout..." -ForegroundColor Yellow
    $logoutResponse = Invoke-WebRequest -Uri "http://localhost:9000/api/auth/logout" -Method POST -Headers @{
        "X-XSRF-TOKEN" = $xsrfToken.Value
    } -WebSession $session
    Write-Host "✅ Logout successful (Status: $($logoutResponse.StatusCode))" -ForegroundColor Green
    
    # Step 6: Verify user is logged out
    Write-Host "`n5️⃣ Verifying logout..." -ForegroundColor Yellow
    try {
        $meResponseAfterLogout = Invoke-WebRequest -Uri "http://localhost:9000/api/auth/me" -WebSession $session
        Write-Host "❌ Unexpected: User still authenticated" -ForegroundColor Red
    } catch {
        Write-Host "✅ Expected: User no longer authenticated" -ForegroundColor Green
    }
    
    Write-Host "`n🏁 All tests completed successfully!" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n❌ Test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}
