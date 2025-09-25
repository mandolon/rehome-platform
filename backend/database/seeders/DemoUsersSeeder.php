<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DemoUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create(['name' => 'Admin One', 'email' => 'admin@example.com', 'role' => 'admin']);
        User::factory()->create(['name' => 'Alice Architect', 'email' => 'alice@example.com', 'role' => 'team', 'team_type' => 'architect']);
        User::factory()->create(['name' => 'Evan Engineer', 'email' => 'evan@example.com', 'role' => 'team', 'team_type' => 'engineer']);
        User::factory()->create(['name' => 'Clara Client', 'email' => 'client@example.com', 'role' => 'client']);
    }
}
