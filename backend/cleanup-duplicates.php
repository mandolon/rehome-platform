<?php

/**
 * Cleanup script to remove duplicate users and inspect database
 * Run with: php cleanup-duplicates.php
 */

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;

echo "=== Database User Inspection ===\n\n";

// Show all users
echo "All users in database:\n";
$users = User::select('id', 'email', 'name', 'role', 'created_at')->orderBy('created_at')->get();
foreach ($users as $user) {
    echo sprintf(
        "ID: %d | Email: %s | Name: %s | Role: %s | Created: %s\n",
        $user->id,
        $user->email,
        $user->name,
        $user->role,
        $user->created_at->format('Y-m-d H:i:s')
    );
}

echo "\n=== Duplicate Check ===\n";

// Check for duplicates
$duplicates = DB::table('users')
    ->select('email', DB::raw('COUNT(*) as count'))
    ->groupBy('email')
    ->having('count', '>', 1)
    ->get();

if ($duplicates->count() > 0) {
    echo "Found duplicate emails:\n";
    foreach ($duplicates as $dup) {
        echo "- {$dup->email} ({$dup->count} instances)\n";
        
        // Show details for each duplicate
        $duplicateUsers = User::where('email', $dup->email)->orderBy('created_at')->get();
        foreach ($duplicateUsers as $index => $user) {
            echo "  " . ($index + 1) . ". ID: {$user->id}, Created: {$user->created_at}\n";
        }
    }
    
    echo "\n=== Cleanup ===\n";
    echo "Removing duplicates (keeping the oldest record for each email)...\n";
    
    foreach ($duplicates as $dup) {
        $users = User::where('email', $dup->email)->orderBy('created_at')->get();
        $keep = $users->first();
        $remove = $users->slice(1);
        
        echo "Keeping user ID {$keep->id} for {$dup->email}\n";
        
        foreach ($remove as $user) {
            echo "  Removing user ID {$user->id}\n";
            $user->delete();
        }
    }
    
    echo "\nCleanup completed!\n";
} else {
    echo "No duplicate emails found.\n";
}

echo "\n=== Final User Count ===\n";
echo "Total users: " . User::count() . "\n";
echo "Unique emails: " . User::distinct('email')->count('email') . "\n";
