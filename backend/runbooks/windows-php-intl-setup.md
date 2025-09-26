# Windows PHP intl Extension Setup

This runbook provides step-by-step instructions for enabling the PHP `intl` extension on Windows, which is required for Laravel Filament and other packages that depend on internationalization features.

## Prerequisites

- PHP 8.2+ installed via WinGet or manual installation
- Administrator privileges (for editing php.ini)
- Composer installed

## Step 1: Detect PHP Configuration

First, identify your PHP installation and configuration:

```powershell
# Check PHP version and configuration
php --ini
php -v
where php
```

**Expected Output:**
```
Configuration File (php.ini) Path: 
Loaded Configuration File: C:\Users\[username]\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\php.ini

PHP 8.2.29 (cli) (built: Jul  1 2025 20:21:12) (ZTS Visual C++ 2019 x64)
```

## Step 2: Locate PHP Installation Directory

Based on the php.ini path, your PHP installation directory will be:
```
C:\Users\[username]\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\
```

## Step 3: Verify Extension Directory

Check that the extension directory is properly configured:

```powershell
# Check extension_dir setting in php.ini
Get-Content "C:\Users\[username]\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\php.ini" | Select-String "extension_dir"
```

**Expected Output:**
```
extension_dir="C:\Users\[username]\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\ext"
```

## Step 4: Verify intl Extension File Exists

Check that the intl extension DLL is present:

```powershell
# Check for php_intl.dll
Test-Path "C:\Users\[username]\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\ext\php_intl.dll"
```

**Expected Output:**
```
True
```

## Step 5: Verify ICU DLLs Exist

The intl extension requires ICU (International Components for Unicode) DLLs:

```powershell
# Check for ICU DLLs in PHP root directory
Get-ChildItem "C:\Users\[username]\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\" | Where-Object { $_.Name -like "*icu*" }
```

**Expected Output:**
```
icu.dll
icuuc.dll
icudt.dll
icuin.dll
```

## Step 6: Enable intl Extension

Add the intl extension to your php.ini file:

```powershell
# Method 1: Add extension line to php.ini
$phpIniPath = "C:\Users\[username]\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\php.ini"
Add-Content -Path $phpIniPath -Value "`nextension=intl"

# Method 2: Uncomment existing line (if present)
$content = Get-Content $phpIniPath
$content -replace '^;extension=intl$', 'extension=intl' | Set-Content $phpIniPath
```

## Step 7: Verify intl Extension is Loaded

Test that the intl extension is properly loaded:

```powershell
# Check if intl module is loaded
php -m | findstr intl

# Check ICU version information
php -i | findstr ICU
```

**Expected Output:**
```
intl

ICU version => 71.1
ICU Data version => 71.1
ICU TZData version => 2022a
ICU Unicode version => 14.0
```

## Step 8: Test Composer Installation

Verify that Composer can install packages without platform requirement issues:

```powershell
# Navigate to your Laravel project
cd backend

# Install dependencies without ignore flags
php composer.phar install --no-interaction
```

**Expected Output:**
```
Installing dependencies from lock file (including require-dev)
Verifying lock file contents can be installed on current platform.
Nothing to install, update or remove
```

## Troubleshooting

### Error: "Unable to load dynamic library 'intl'"

**Cause:** Missing ICU DLLs or incorrect extension path.

**Solution:**
1. Verify ICU DLLs exist in PHP root directory
2. Check extension_dir path in php.ini
3. Ensure php_intl.dll exists in extensions directory

### Error: "ICU version mismatch"

**Cause:** ICU DLLs don't match PHP build.

**Solution:**
1. Download matching PHP build with intl support
2. Or copy ICU DLLs from PHP distribution

### Error: "Composer platform requirements not met"

**Cause:** intl extension not loaded.

**Solution:**
1. Follow steps 1-7 above
2. Restart command prompt/PowerShell
3. Verify with `php -m | findstr intl`

### WinGet PHP Installation Issues

If using WinGet-installed PHP:

1. **Check installation:**
   ```powershell
   winget list PHP.PHP
   ```

2. **Reinstall if needed:**
   ```powershell
   winget uninstall PHP.PHP
   winget install PHP.PHP
   ```

3. **Verify paths:**
   ```powershell
   php --ini
   where php
   ```

## Verification Checklist

- [ ] PHP version detected (`php -v`)
- [ ] php.ini path identified (`php --ini`)
- [ ] extension_dir configured correctly
- [ ] php_intl.dll exists in ext directory
- [ ] ICU DLLs present in PHP root directory
- [ ] intl extension enabled in php.ini
- [ ] intl module loaded (`php -m | findstr intl`)
- [ ] ICU version displayed (`php -i | findstr ICU`)
- [ ] Composer installs without platform errors

## Common php.ini Settings

Ensure these settings are present in your php.ini:

```ini
; Extension directory
extension_dir="C:\Users\[username]\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\ext"

; Enable intl extension
extension=intl

; Optional: Set default locale
intl.default_locale = en_US
intl.error_level = E_WARNING
```

## Notes

- **WinGet PHP**: Automatically includes intl extension and ICU DLLs
- **Manual PHP**: May require separate ICU DLL download
- **XAMPP/WAMP**: Usually includes intl by default
- **Docker**: Use official PHP images with intl extension

## Related Commands

```powershell
# Check all loaded extensions
php -m

# Detailed PHP configuration
php -i

# Check specific extension info
php -i | findstr -i intl

# Test Composer platform requirements
composer check-platform-reqs
```
