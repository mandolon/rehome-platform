# Simple CSRF test to debug the 419 error
Write-Host "🔍 Debugging CSRF Token Issue..." -ForegroundColor Cyan

try {
    # Get CSRF token
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $csrfResponse = Invoke-WebRequest -Uri "http://localhost:9000/sanctum/csrf-cookie" -WebSession $session
    Write-Host "CSRF Response Status: $($csrfResponse.StatusCode)" -ForegroundColor Green
    
    # Extract and decode XSRF token
    $xsrfToken = $session.Cookies.GetCookies("http://localhost:9000") | Where-Object {$_.Name -eq "XSRF-TOKEN"}
    if ($xsrfToken) {
        $rawToken = $xsrfToken.Value
        $decodedToken = [System.Web.HttpUtility]::UrlDecode($rawToken)
        Write-Host "Raw XSRF Token: $($rawToken.Substring(0,50))..." -ForegroundColor Yellow
        Write-Host "Decoded XSRF Token: $($decodedToken.Substring(0,50))..." -ForegroundColor Yellow
        
        # Test login with decoded token
        $loginBody = @{
            email = "admin@rehome.com"
            password = "password"
        } | ConvertTo-Json
        
        Write-Host "`nTesting login with decoded token..." -ForegroundColor Yellow
        $loginResponse = Invoke-WebRequest -Uri "http://localhost:9000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -Headers @{
            "Origin" = "http://localhost:3000"
            "Referer" = "http://localhost:3000"
            "X-XSRF-TOKEN" = $decodedToken
        } -WebSession $session
        
        Write-Host "✅ Login successful with decoded token!" -ForegroundColor Green
        $loginData = $loginResponse.Content | ConvertFrom-Json
        Write-Host "User: $($loginData.data.name)" -ForegroundColor Green
        
    } else {
        Write-Host "❌ No XSRF token found" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $response = $_.Exception.Response
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Red
        Write-Host "Status Description: $($response.StatusDescription)" -ForegroundColor Red
    }
}
