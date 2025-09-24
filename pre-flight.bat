@echo off
echo === Pre-flight Checks (Fast Dev Loop) ===
echo Running all checks that CodeRabbit and CI will perform...

set ERROR_COUNT=0

echo.
echo 🔧 Backend Checks...
cd backend

echo   - Validating Composer...
composer validate --strict
if %ERRORLEVEL% neq 0 (
    echo   ❌ Composer validation failed
    set /a ERROR_COUNT+=1
) else (
    echo   ✅ Composer validation passed
)

echo   - Installing dependencies...
composer install --no-interaction --prefer-dist --optimize-autoloader --quiet
if %ERRORLEVEL% neq 0 (
    echo   ❌ Composer install failed
    set /a ERROR_COUNT+=1
) else (
    echo   ✅ Dependencies installed
)

echo   - Running Laravel tests...
php artisan test --stop-on-failure
if %ERRORLEVEL% neq 0 (
    echo   ❌ Laravel tests failed
    set /a ERROR_COUNT+=1
) else (
    echo   ✅ Laravel tests passed
)

echo   - Security audit...
composer audit --no-dev 2>nul
if %ERRORLEVEL% neq 0 (
    echo   ⚠️  Security vulnerabilities found (check composer audit)
    set /a ERROR_COUNT+=1
) else (
    echo   ✅ No security vulnerabilities
)

echo   - Code style check...
if exist "vendor\bin\pint.bat" (
    vendor\bin\pint --test
    if %ERRORLEVEL% neq 0 (
        echo   ⚠️  Code style issues found (run vendor\bin\pint to fix)
    ) else (
        echo   ✅ Code style clean
    )
) else (
    echo   ℹ️  Laravel Pint not installed (optional)
)

echo.
echo ⚛️  Frontend Checks...
cd ..\frontend

echo   - Installing dependencies...
call npm ci --silent
if %ERRORLEVEL% neq 0 (
    echo   ❌ npm install failed
    set /a ERROR_COUNT+=1
) else (
    echo   ✅ Dependencies installed
)

echo   - Linting code...
call npm run lint
if %ERRORLEVEL% neq 0 (
    echo   ❌ ESLint failed
    set /a ERROR_COUNT+=1
) else (
    echo   ✅ Linting passed
)

echo   - Type checking...
call npm run typecheck
if %ERRORLEVEL% neq 0 (
    echo   ❌ TypeScript errors found
    set /a ERROR_COUNT+=1
) else (
    echo   ✅ Type checking passed
)

echo   - Running tests...
call npm run test -- --run --reporter=basic
if %ERRORLEVEL% neq 0 (
    echo   ❌ Frontend tests failed
    set /a ERROR_COUNT+=1
) else (
    echo   ✅ Frontend tests passed
)

echo   - Security audit...
call npm audit --audit-level=high --silent
if %ERRORLEVEL% neq 0 (
    echo   ⚠️  Security vulnerabilities found (check npm audit)
    set /a ERROR_COUNT+=1
) else (
    echo   ✅ No high-severity vulnerabilities
)

echo   - Build check...
call npm run build --silent
if %ERRORLEVEL% neq 0 (
    echo   ⚠️  Build failed (may cause deployment issues)
) else (
    echo   ✅ Build successful
)

cd ..

echo.
echo === Pre-flight Results ===
if %ERROR_COUNT% equ 0 (
    echo 🎉 All checks passed! Ready for PR submission.
    echo.
    echo Next steps:
    echo 1. git add . ^&^& git commit -m "your message"
    echo 2. git push
    echo 3. Create PR and wait for CodeRabbit review
) else (
    echo ❌ %ERROR_COUNT% check(s) failed. Fix issues before creating PR.
    echo.
    echo CodeRabbit and CI will also catch these issues, but fixing locally is faster.
)

echo.
echo 🤖 CodeRabbit will also check:
echo    - Sanctum auth middleware on protected routes
echo    - Axios withCredentials configuration  
echo    - CORS security settings
echo    - Laravel and React best practices

pause
