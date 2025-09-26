<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DemoUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $demoUsers = [
            [
                'name' => 'Admin One',
                'email' => 'admin@example.com',
                'role' => 'admin',
                'team_type' => null,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Alice Architect',
                'email' => 'alice@example.com',
                'role' => 'team',
                'team_type' => 'architect',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Evan Engineer',
                'email' => 'evan@example.com',
                'role' => 'team',
                'team_type' => 'engineer',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Clara Client',
                'email' => 'client@example.com',
                'role' => 'client',
                'team_type' => null,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        ];

        foreach ($demoUsers as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']], // Unique key
                $userData // Data to upsert
            );
        }
    }
}
