@echo off
echo === Sanctum SPA Smoke Test ===

echo.
echo 1. CSRF Bootstrap...
curl.exe -s -c cookies.txt http://localhost:9000/sanctum/csrf-cookie > nul
curl.exe -s -D csrf_headers.txt -o nul http://localhost:9000/sanctum/csrf-cookie
findstr "HTTP/" csrf_headers.txt
findstr "Set-Cookie: XSRF-TOKEN" csrf_headers.txt | findstr /C:"samesite=lax"
findstr "Set-Cookie: rehome-platform-session" csrf_headers.txt | findstr /C:"httponly"

echo.
echo 2. Login Test (without XSRF token - should get 419)...
curl.exe -s -o login_no_token.out -w "%%{http_code}" -H "Content-Type: application/json" -H "Origin: http://localhost:3000" -H "Referer: http://localhost:3000" -b cookies.txt -c cookies.txt -d "{\"email\":\"admin@rehome.com\",\"password\":\"password\"}" http://localhost:9000/api/auth/login > login_status.txt
set /p LOGIN_STATUS=<login_status.txt
echo Login without XSRF token: %LOGIN_STATUS%

echo.
echo 3. Me Test (unauthenticated - should get 401)...
curl.exe -s -o me_unauth.out -w "%%{http_code}" -H "Origin: http://localhost:3000" -H "Referer: http://localhost:3000" -b cookies.txt http://localhost:9000/api/auth/me > me_status.txt
set /p ME_STATUS=<me_status.txt
echo Me without auth: %ME_STATUS%

echo.
echo === Test Results ===
echo CSRF: Should see 204, XSRF-TOKEN (samesite=lax), session (httponly)
echo Login: Should get 419 (Page Expired) without XSRF token
echo Me: Should get 401 (Unauthorized) without authentication
echo.
echo To complete the test with XSRF token, extract it from cookies.txt and use X-XSRF-TOKEN header
