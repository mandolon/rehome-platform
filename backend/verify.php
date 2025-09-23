<?php

// Simple verification script for the Laravel backend structure
echo "=== Rehome Platform Backend Verification ===\n\n";

// Check directory structure
$requiredDirs = [
    'app/Models',
    'app/Http/Controllers/Api',
    'app/Http/Middleware',
    'app/Enums',
    'config',
    'database/migrations',
    'database/seeders',
    'routes',
    'storage/app',
    'storage/framework',
    'storage/logs',
];

echo "1. Checking directory structure:\n";
foreach ($requiredDirs as $dir) {
    $exists = is_dir(__DIR__ . '/' . $dir);
    echo "   - {$dir}: " . ($exists ? "✓" : "✗") . "\n";
}

// Check required files
$requiredFiles = [
    '.env.example',
    'composer.json',
    'artisan',
    'public/index.php',
    'bootstrap/app.php',
    'config/app.php',
    'config/database.php',
    'config/sanctum.php',
    'app/Models/User.php',
    'app/Enums/UserRole.php',
    'app/Http/Controllers/Api/AuthController.php',
    'app/Http/Middleware/RoleMiddleware.php',
    'routes/api.php',
    'routes/web.php',
    'database/migrations/0001_01_01_000000_create_users_table.php',
    'database/migrations/2019_12_14_000001_create_personal_access_tokens_table.php',
    'database/seeders/DatabaseSeeder.php',
];

echo "\n2. Checking required files:\n";
foreach ($requiredFiles as $file) {
    $exists = file_exists(__DIR__ . '/' . $file);
    echo "   - {$file}: " . ($exists ? "✓" : "✗") . "\n";
}

// Check PHP syntax for key files
$phpFiles = [
    'app/Models/User.php',
    'app/Enums/UserRole.php',
    'app/Http/Controllers/Api/AuthController.php',
    'app/Http/Middleware/RoleMiddleware.php',
    'routes/api.php',
    'database/seeders/DatabaseSeeder.php',
];

echo "\n3. Checking PHP syntax:\n";
foreach ($phpFiles as $file) {
    $fullPath = __DIR__ . '/' . $file;
    if (file_exists($fullPath)) {
        $output = shell_exec("php -l {$fullPath} 2>&1");
        $valid = strpos($output, 'No syntax errors detected') !== false;
        echo "   - {$file}: " . ($valid ? "✓" : "✗ - {$output}") . "\n";
    }
}

echo "\n=== Verification Complete ===\n";
echo "Next Steps:\n";
echo "1. Install Laravel dependencies: composer install\n";
echo "2. Copy environment file: cp .env.example .env\n";
echo "3. Configure database settings in .env\n";
echo "4. Generate application key: php artisan key:generate\n";
echo "5. Run migrations: php artisan migrate\n";
echo "6. Seed database: php artisan db:seed\n";
echo "7. Start server: php artisan serve\n";
echo "\nAPI will be available at http://localhost:8000\n";