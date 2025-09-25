<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use App\Models\Attachment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Only create test accounts in local environment
        if (!app()->environment('local')) {
            $this->command->info('Skipping local test account creation — not in local environment.');
            return;
        }

        $testPassword = env('TEST_ACCOUNT_PASSWORD', 'password');

        // Create specific users using updateOrCreate to prevent duplicates
        $admin = User::updateOrCreate(
            ['email' => 'admin@rehome.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make($testPassword),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        $pm = User::updateOrCreate(
            ['email' => 'pm@rehome.com'],
            [
                'name' => 'Project Manager',
                'password' => Hash::make($testPassword),
                'role' => 'project_manager',
                'email_verified_at' => now(),
            ]
        );

        $teamMember1 = User::updateOrCreate(
            ['email' => 'team1@rehome.com'],
            [
                'name' => 'Team Member 1',
                'password' => Hash::make($testPassword),
                'role' => 'team_member',
                'email_verified_at' => now(),
            ]
        );

        $teamMember2 = User::updateOrCreate(
            ['email' => 'team2@rehome.com'],
            [
                'name' => 'Team Member 2',
                'password' => Hash::make($testPassword),
                'role' => 'team_member',
                'email_verified_at' => now(),
            ]
        );

        $client = User::updateOrCreate(
            ['email' => 'client@rehome.com'],
            [
                'name' => 'Client User',
                'password' => Hash::make($testPassword),
                'role' => 'client',
                'email_verified_at' => now(),
            ]
        );

        // Create projects using updateOrCreate to prevent duplicates
        $project1 = Project::updateOrCreate(
            ['name' => 'Website Redesign'],
            [
                'description' => 'Complete redesign of the company website',
                'owner_id' => $pm->id,
                'status' => 'active',
                'start_date' => now()->subDays(30),
                'end_date' => now()->addDays(60),
            ]
        );

        $project2 = Project::updateOrCreate(
            ['name' => 'Mobile App Development'],
            [
                'description' => 'Development of iOS and Android mobile applications',
                'owner_id' => $pm->id,
                'status' => 'planned',
                'start_date' => now()->addDays(15),
                'end_date' => now()->addDays(120),
            ]
        );

        // Create tasks using updateOrCreate to prevent duplicates
        Task::updateOrCreate(
            ['title' => 'Design Homepage', 'project_id' => $project1->id],
            [
                'description' => 'Create mockups for the new homepage design',
                'assignee_id' => $teamMember1->id,
                'status' => 'progress',
                'priority' => 'high',
                'due_date' => now()->addDays(7),
            ]
        );

        Task::updateOrCreate(
            ['title' => 'Implement Authentication', 'project_id' => $project1->id],
            [
                'description' => 'Set up user authentication system',
                'assignee_id' => $teamMember2->id,
                'status' => 'completed',
                'priority' => 'high',
                'due_date' => now()->subDays(5),
            ]
        );

        Task::updateOrCreate(
            ['title' => 'API Documentation', 'project_id' => $project1->id],
            [
                'description' => 'Write comprehensive API documentation',
                'assignee_id' => $teamMember1->id,
                'status' => 'redline',
                'priority' => 'med',
                'due_date' => now()->addDays(14),
            ]
        );

        Task::updateOrCreate(
            ['title' => 'Market Research', 'project_id' => $project2->id],
            [
                'description' => 'Research competitor mobile apps',
                'assignee_id' => $teamMember2->id,
                'status' => 'progress',
                'priority' => 'med',
                'due_date' => now()->addDays(10),
            ]
        );

        Task::updateOrCreate(
            ['title' => 'UI/UX Design', 'project_id' => $project2->id],
            [
                'description' => 'Create mobile app wireframes and designs',
                'assignee_id' => $teamMember1->id,
                'status' => 'redline',
                'priority' => 'high',
                'due_date' => now()->addDays(21),
            ]
        );

        Task::updateOrCreate(
            ['title' => 'Backend Setup', 'project_id' => $project2->id],
            [
                'description' => 'Set up backend infrastructure for mobile app',
                'assignee_id' => $teamMember2->id,
                'status' => 'redline',
                'priority' => 'high',
                'due_date' => now()->addDays(28),
            ]
        );

        // Create some attachments using updateOrCreate to prevent duplicates
        Attachment::updateOrCreate(
            ['name' => 'project_requirements.pdf', 'attachable_type' => Project::class, 'attachable_id' => $project1->id],
            [
                'path' => 'attachments/project_requirements.pdf',
                'mime' => 'application/pdf',
                'size' => 1024000,
                'uploaded_by' => $pm->id,
            ]
        );

        $firstTask = Task::where('project_id', $project1->id)->first();
        if ($firstTask) {
            Attachment::updateOrCreate(
                ['name' => 'design_mockup.png', 'attachable_type' => Task::class, 'attachable_id' => $firstTask->id],
                [
                    'path' => 'attachments/design_mockup.png',
                    'mime' => 'image/png',
                    'size' => 512000,
                    'uploaded_by' => $teamMember1->id,
                ]
            );
        }

        // Seed sample Requests
        $this->call(RequestSeeder::class);
        
        // Seed admin user for Filament panel
        $this->call(AdminUserSeeder::class);
        
        // Seed demo users by role
        $this->call(DemoUsersSeeder::class);
    }
}
