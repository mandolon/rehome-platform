<?php

namespace Database\Seeders;

use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create default admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@rehome.com',
            'password' => Hash::make('password123'),
            'role' => UserRole::ADMIN,
            'is_active' => true,
        ]);

        // Create sample project manager
        User::create([
            'name' => 'John Project Manager',
            'email' => 'pm@rehome.com',
            'password' => Hash::make('password123'),
            'role' => UserRole::PROJECT_MANAGER,
            'is_active' => true,
        ]);

        // Create sample team member
        User::create([
            'name' => 'Jane Team Member',
            'email' => 'team@rehome.com',
            'password' => Hash::make('password123'),
            'role' => UserRole::TEAM_MEMBER,
            'is_active' => true,
        ]);

        // Create sample client
        User::create([
            'name' => 'Client User',
            'email' => 'client@rehome.com',
            'password' => Hash::make('password123'),
            'role' => UserRole::CLIENT,
            'is_active' => true,
        ]);
    }
}