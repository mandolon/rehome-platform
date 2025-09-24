@echo off
echo === CodeRabbit Testing Setup ===
echo This script creates test branches to validate CodeRabbit custom prompts

echo.
echo 1. Creating test branch for unguarded API route...
git checkout -b test/coderabbit-auth-guard
echo. >> backend\routes\api.php
echo // TEST: This should trigger CodeRabbit auth guard warning >> backend\routes\api.php
echo Route::post('/auth/danger', fn() =^> 'nope'); >> backend\routes\api.php
git add backend\routes\api.php
git commit -m "test: add unguarded stateful route (should be flagged by CodeRabbit)"
echo Branch created: test/coderabbit-auth-guard

echo.
echo 2. Creating test branch for axios without credentials...
git checkout main
git checkout -b test/coderabbit-axios-credentials
powershell -Command "(Get-Content frontend\src\lib\api.ts) -replace 'withCredentials: true,', '// withCredentials: true, // REMOVED FOR TEST' | Set-Content frontend\src\lib\api.ts"
git add frontend\src\lib\api.ts
git commit -m "test: remove withCredentials to trigger CodeRabbit review"
echo Branch created: test/coderabbit-axios-credentials

echo.
echo 3. Creating test branch for overbroad CORS...
git checkout main
git checkout -b test/coderabbit-cors-wildcard
powershell -Command "(Get-Content backend\config\cors.php) -replace \"env\('FRONTEND_URL', 'http://localhost:3000'\),\", \"'*', // TEST: Wildcard CORS (should be flagged)\" | Set-Content backend\config\cors.php"
git add backend\config\cors.php
git commit -m "test: loosen CORS to wildcard (should fail CodeRabbit review)"
echo Branch created: test/coderabbit-cors-wildcard

echo.
echo === Next Steps ===
echo 1. Push branches to GitHub:
echo    git push -u origin test/coderabbit-auth-guard
echo    git push -u origin test/coderabbit-axios-credentials  
echo    git push -u origin test/coderabbit-cors-wildcard
echo.
echo 2. Create PRs for each branch and watch CodeRabbit flag the issues
echo.
echo 3. Verify required status checks in Settings ^> Branches ^> Branch protection
echo.
echo 4. Run local pre-flight checks:
echo    cd backend ^&^& composer validate --strict ^&^& php artisan test
echo    cd frontend ^&^& npm ci ^&^& npm run lint ^&^& npm run typecheck ^&^& npm test

pause
