<?php

namespace Database\Seeders;

use App\Models\Request;
use App\Models\RequestComment;
use App\Models\User;
use Illuminate\Database\Seeder;

class RequestDemoSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure we have users to work with
        $users = User::all();
        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run DemoSeeder first.');
            return;
        }

        $this->command->info('Creating 10 demo requests with comments...');

        // Create 10 requests with varied statuses and assignments
        $requests = collect([
            [
                'title' => 'Fix login authentication issue',
                'body' => 'Users are reporting that they cannot log in with their credentials. This is affecting multiple users.',
                'status' => 'open',
                'requester_id' => $users->where('role', 'client')->first()?->id ?? $users->first()->id,
                'assignee_id' => $users->where('role', 'team_member')->first()?->id,
            ],
            [
                'title' => 'Update homepage design',
                'body' => 'The homepage needs a fresh design update to match our new brand guidelines.',
                'status' => 'in_progress',
                'requester_id' => $users->where('role', 'project_manager')->first()?->id ?? $users->first()->id,
                'assignee_id' => $users->where('role', 'team_member')->skip(1)->first()?->id,
            ],
            [
                'title' => 'Database performance optimization',
                'body' => 'The database queries are running slowly. Need to optimize for better performance.',
                'status' => 'needs_info',
                'requester_id' => $users->where('role', 'admin')->first()?->id ?? $users->first()->id,
                'assignee_id' => null,
            ],
            [
                'title' => 'Mobile app navigation fix',
                'body' => 'Navigation menu is not working properly on mobile devices.',
                'status' => 'resolved',
                'requester_id' => $users->where('role', 'team_member')->first()?->id ?? $users->first()->id,
                'assignee_id' => $users->where('role', 'team_member')->skip(1)->first()?->id,
            ],
            [
                'title' => 'Email notification system',
                'body' => 'Implement email notifications for request updates and status changes.',
                'status' => 'draft',
                'requester_id' => $users->where('role', 'project_manager')->first()?->id ?? $users->first()->id,
                'assignee_id' => null,
            ],
            [
                'title' => 'User profile page redesign',
                'body' => 'The user profile page needs a complete redesign for better user experience.',
                'status' => 'open',
                'requester_id' => $users->where('role', 'client')->first()?->id ?? $users->first()->id,
                'assignee_id' => $users->where('role', 'team_member')->first()?->id,
            ],
            [
                'title' => 'API rate limiting implementation',
                'body' => 'Need to implement rate limiting for API endpoints to prevent abuse.',
                'status' => 'in_progress',
                'requester_id' => $users->where('role', 'admin')->first()?->id ?? $users->first()->id,
                'assignee_id' => $users->where('role', 'team_member')->skip(1)->first()?->id,
            ],
            [
                'title' => 'Documentation update',
                'body' => 'Update API documentation to reflect recent changes.',
                'status' => 'closed',
                'requester_id' => $users->where('role', 'team_member')->first()?->id ?? $users->first()->id,
                'assignee_id' => $users->where('role', 'project_manager')->first()?->id,
            ],
            [
                'title' => 'Security audit findings',
                'body' => 'Address security vulnerabilities found in the recent audit.',
                'status' => 'needs_info',
                'requester_id' => $users->where('role', 'admin')->first()?->id ?? $users->first()->id,
                'assignee_id' => null,
            ],
            [
                'title' => 'Feature request: Dark mode',
                'body' => 'Users have requested a dark mode option for the application.',
                'status' => 'draft',
                'requester_id' => $users->where('role', 'client')->first()?->id ?? $users->first()->id,
                'assignee_id' => null,
            ],
        ]);

        $createdRequests = collect();

        foreach ($requests as $requestData) {
            $request = Request::create($requestData);
            $createdRequests->push($request);
            $this->command->info("Created request: {$request->title}");
        }

        // Create 30 comments distributed across the requests
        $this->command->info('Creating 30 comments...');
        
        $commentTemplates = [
            'Thanks for reporting this issue. I\'ll look into it.',
            'This has been assigned to me. I\'ll start working on it today.',
            'Can you provide more details about the specific error message?',
            'I\'ve identified the root cause. Working on a fix now.',
            'The fix has been implemented and deployed to staging.',
            'This is now resolved. Please test and confirm.',
            'I need more information to proceed with this request.',
            'This is a duplicate of another request. Closing.',
            'Moving this to the next sprint for implementation.',
            'The requirements are unclear. Can we schedule a meeting?',
            'I\'ve completed the initial analysis. Here are my findings...',
            'This will require additional resources. Let me check availability.',
            'The implementation is complete. Ready for testing.',
            'I\'ve updated the documentation as requested.',
            'This is a low priority item. Will address when time permits.',
        ];

        for ($i = 0; $i < 30; $i++) {
            $request = $createdRequests->random();
            $user = $users->random();
            
            $comment = RequestComment::create([
                'request_id' => $request->id,
                'user_id' => $user->id,
                'body' => $commentTemplates[array_rand($commentTemplates)],
                'created_at' => fake()->dateTimeBetween($request->created_at, 'now'),
            ]);

            if ($i % 5 === 0) {
                $this->command->info("Created comment " . ($i + 1) . "/30");
            }
        }

        $this->command->info('Demo data created successfully!');
        $this->command->info("- {$createdRequests->count()} requests");
        $this->command->info('- 30 comments');
        $this->command->info('- Various statuses and assignments');
    }
}