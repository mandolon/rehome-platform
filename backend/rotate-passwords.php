<?php

/**
 * Password rotation script for test accounts
 * Run with: php rotate-passwords.php
 */

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== Password Rotation for Test Accounts ===\n\n";

$testEmails = [
    'admin@rehome.com',
    'pm@rehome.com', 
    'team1@rehome.com',
    'team2@rehome.com',
    'client@rehome.com'
];

$newPassword = env('TEST_ACCOUNT_PASSWORD', 'password');

echo "Rotating passwords for test accounts...\n";
echo "New password: {$newPassword}\n\n";

foreach ($testEmails as $email) {
    $user = User::where('email', $email)->first();
    
    if ($user) {
        $user->password = Hash::make($newPassword);
        $user->save();
        echo "✓ Updated password for {$email}\n";
    } else {
        echo "✗ User not found: {$email}\n";
    }
}

echo "\nPassword rotation completed!\n";
echo "\nTest account credentials:\n";
echo "Email: admin@rehome.com | Password: {$newPassword} | Role: admin\n";
echo "Email: pm@rehome.com | Password: {$newPassword} | Role: project_manager\n";
echo "Email: team1@rehome.com | Password: {$newPassword} | Role: team_member\n";
echo "Email: team2@rehome.com | Password: {$newPassword} | Role: team_member\n";
echo "Email: client@rehome.com | Password: {$newPassword} | Role: client\n";
