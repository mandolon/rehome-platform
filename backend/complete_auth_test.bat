@echo off
echo === Complete Sanctum Auth Flow Test ===

echo.
echo 1. CSRF Bootstrap...
curl.exe -s -c cookies.txt http://localhost:9000/sanctum/csrf-cookie > nul
curl.exe -s -D csrf_headers.txt -o nul http://localhost:9000/sanctum/csrf-cookie
findstr "HTTP/" csrf_headers.txt

echo.
echo 2. Extract XSRF Token...
powershell -NoProfile -Command "Add-Type -AssemblyName System.Web; $line = (Get-Content cookies.txt | Select-String 'XSRF-TOKEN').ToString(); $raw = $line.Split(\"`t\")[-1]; $decoded = [System.Web.HttpUtility]::UrlDecode($raw); $decoded | Out-File -Encoding ascii xsrf_token.txt"
set /p XSRF_TOKEN=<xsrf_token.txt
echo XSRF Token extracted (first 30 chars): %XSRF_TOKEN:~0,30%...

echo.
echo 3. Login with XSRF Token...
curl.exe -s -o login_auth.out -w "%%{http_code}" -H "X-XSRF-TOKEN: %XSRF_TOKEN%" -H "Content-Type: application/json" -H "Accept: application/json" -H "Origin: http://localhost:3000" -H "Referer: http://localhost:3000" -b cookies.txt -c cookies.txt -d "{\"email\":\"admin@rehome.com\",\"password\":\"password\"}" http://localhost:9000/api/auth/login > login_auth_status.txt
set /p LOGIN_STATUS=<login_auth_status.txt
echo Login with XSRF: %LOGIN_STATUS%
if exist login_auth.out (
    echo Login response body:
    type login_auth.out | findstr /C:"message" /C:"user" /C:"email"
)

echo.
echo 4. Test /me endpoint (authenticated)...
curl.exe -s -o me_auth.out -w "%%{http_code}" -H "Accept: application/json" -H "Origin: http://localhost:3000" -H "Referer: http://localhost:3000" -b cookies.txt http://localhost:9000/api/auth/me > me_auth_status.txt
set /p ME_STATUS=<me_auth_status.txt
echo Me endpoint: %ME_STATUS%
if exist me_auth.out (
    echo Me response body:
    type me_auth.out | findstr /C:"user" /C:"email" /C:"name"
)

echo.
echo === Expected Results ===
echo CSRF: 204 No Content
echo Login: 200 with user JSON
echo Me: 200 with user JSON
echo.
echo If any step fails, check storage/logs/laravel.log for errors
