<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Only create demo accounts in local environment
        if (!app()->environment('local')) {
            $this->command->info('Skipping demo account creation — not in local environment.');
            return;
        }

        $testPassword = env('TEST_ACCOUNT_PASSWORD', 'password');

        // Create admin demo user
        $admin = User::updateOrCreate(
            ['email' => 'admin@demo.test'],
            [
                'name' => 'Admin Demo',
                'password' => Hash::make($testPassword),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Created admin demo user: admin@demo.test / password');

        // Create additional users for demo
        $pm = User::updateOrCreate(
            ['email' => 'pm@demo.test'],
            [
                'name' => 'Project Manager Demo',
                'password' => Hash::make($testPassword),
                'role' => 'project_manager',
                'email_verified_at' => now(),
            ]
        );

        $team1 = User::updateOrCreate(
            ['email' => 'team1@demo.test'],
            [
                'name' => 'Team Member 1 Demo',
                'password' => Hash::make($testPassword),
                'role' => 'team_member',
                'email_verified_at' => now(),
            ]
        );

        $team2 = User::updateOrCreate(
            ['email' => 'team2@demo.test'],
            [
                'name' => 'Team Member 2 Demo',
                'password' => Hash::make($testPassword),
                'role' => 'team_member',
                'email_verified_at' => now(),
            ]
        );

        // Create demo projects
        $project1 = Project::updateOrCreate(
            ['name' => 'Website Redesign Demo'],
            [
                'description' => 'Complete redesign of the company website with modern UI/UX',
                'owner_id' => $pm->id,
                'status' => 'active',
                'start_date' => now()->subDays(30),
                'end_date' => now()->addDays(60),
            ]
        );

        $project2 = Project::updateOrCreate(
            ['name' => 'Mobile App Development Demo'],
            [
                'description' => 'Development of iOS and Android mobile applications',
                'owner_id' => $pm->id,
                'status' => 'planned',
                'start_date' => now()->addDays(15),
                'end_date' => now()->addDays(120),
            ]
        );

        $project3 = Project::updateOrCreate(
            ['name' => 'API Integration Demo'],
            [
                'description' => 'Third-party API integrations and webhook implementations',
                'owner_id' => $pm->id,
                'status' => 'active',
                'start_date' => now()->subDays(10),
                'end_date' => now()->addDays(45),
            ]
        );

        // Create demo tasks
        $tasks = [
            [
                'title' => 'Design Homepage Mockups',
                'description' => 'Create wireframes and mockups for the new homepage design',
                'project_id' => $project1->id,
                'assignee_id' => $team1->id,
                'status' => 'progress',
                'priority' => 'high',
                'due_date' => now()->addDays(7),
            ],
            [
                'title' => 'Implement User Authentication',
                'description' => 'Set up secure user authentication system with role-based access',
                'project_id' => $project1->id,
                'assignee_id' => $team2->id,
                'status' => 'completed',
                'priority' => 'high',
                'due_date' => now()->subDays(5),
            ],
            [
                'title' => 'Write API Documentation',
                'description' => 'Create comprehensive API documentation with examples',
                'project_id' => $project1->id,
                'assignee_id' => $team1->id,
                'status' => 'redline',
                'priority' => 'med',
                'due_date' => now()->addDays(14),
            ],
            [
                'title' => 'Mobile App Wireframes',
                'description' => 'Create wireframes for mobile app screens',
                'project_id' => $project2->id,
                'assignee_id' => $team1->id,
                'status' => 'progress',
                'priority' => 'high',
                'due_date' => now()->addDays(10),
            ],
            [
                'title' => 'Backend API Setup',
                'description' => 'Set up backend infrastructure for mobile app',
                'project_id' => $project2->id,
                'assignee_id' => $team2->id,
                'status' => 'redline',
                'priority' => 'high',
                'due_date' => now()->addDays(21),
            ],
            [
                'title' => 'Payment Gateway Integration',
                'description' => 'Integrate Stripe payment gateway for mobile app',
                'project_id' => $project2->id,
                'assignee_id' => $team1->id,
                'status' => 'progress',
                'priority' => 'med',
                'due_date' => now()->addDays(28),
            ],
            [
                'title' => 'Third-party API Research',
                'description' => 'Research and evaluate third-party APIs for integration',
                'project_id' => $project3->id,
                'assignee_id' => $team2->id,
                'status' => 'completed',
                'priority' => 'med',
                'due_date' => now()->subDays(3),
            ],
            [
                'title' => 'Webhook Implementation',
                'description' => 'Implement webhook endpoints for real-time data sync',
                'project_id' => $project3->id,
                'assignee_id' => $team1->id,
                'status' => 'progress',
                'priority' => 'high',
                'due_date' => now()->addDays(12),
            ],
            [
                'title' => 'API Rate Limiting',
                'description' => 'Implement rate limiting for API endpoints',
                'project_id' => $project3->id,
                'assignee_id' => $team2->id,
                'status' => 'redline',
                'priority' => 'med',
                'due_date' => now()->addDays(18),
            ],
            [
                'title' => 'Database Optimization',
                'description' => 'Optimize database queries and add proper indexing',
                'project_id' => $project1->id,
                'assignee_id' => $team2->id,
                'status' => 'progress',
                'priority' => 'low',
                'due_date' => now()->addDays(25),
            ],
        ];

        foreach ($tasks as $taskData) {
            Task::updateOrCreate(
                ['title' => $taskData['title'], 'project_id' => $taskData['project_id']],
                $taskData
            );
        }

        $this->command->info('Created demo data:');
        $this->command->info('- 4 users (1 admin, 1 PM, 2 team members)');
        $this->command->info('- 3 projects');
        $this->command->info('- 10 tasks');
    }
}
