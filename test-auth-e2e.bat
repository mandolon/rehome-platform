@echo off
echo Testing Authentication E2E Flow...
echo.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0scripts\dev-auth-e2e.ps1"
pause