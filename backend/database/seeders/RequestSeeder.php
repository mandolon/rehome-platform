<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Request as RequestModel;
use App\Models\RequestComment;
use App\Models\RequestParticipant;

class RequestSeeder extends Seeder
{
    public function run(): void
    {
        // Create users (minimal set) if not present
        $admin = User::firstOrCreate([
            'email' => 'admin+requests@rehome.com',
        ], [
            'name' => 'Admin Requests',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $team1 = User::firstOrCreate([
            'email' => 'team1+requests@rehome.com',
        ], [
            'name' => 'Team User 1',
            'password' => bcrypt('password'),
            'role' => 'team_member',
        ]);

        $team2 = User::firstOrCreate([
            'email' => 'team2+requests@rehome.com',
        ], [
            'name' => 'Team User 2',
            'password' => bcrypt('password'),
            'role' => 'team_member',
        ]);

        $users = collect([$team1, $team2]);

        // Create 5 requests with mixed assignees
        $requests = collect(range(1, 5))->map(function ($i) use ($admin, $users) {
            /** @var User $assignee */
            $assignee = $users->random();
            return RequestModel::create([
                'title' => "Seeded Request #{$i}",
                'status' => 'open',
                'creator_id' => $admin->id,
                'assignee_id' => $assignee->id,
            ]);
        });

        // For each request: add 2 comments and participants (creator, assignee, +1 watcher)
        $requests->each(function (RequestModel $req) use ($admin, $users) {
            // Comments
            RequestComment::create([
                'request_id' => $req->id,
                'user_id' => $admin->id,
                'body' => 'Initial admin comment',
            ]);
            RequestComment::create([
                'request_id' => $req->id,
                'user_id' => $req->assignee_id,
                'body' => 'Assignee acknowledgment',
            ]);

            // Participants
            RequestParticipant::firstOrCreate([
                'request_id' => $req->id,
                'user_id' => $admin->id,
            ], ['role' => 'creator']);

            if ($req->assignee_id) {
                RequestParticipant::firstOrCreate([
                    'request_id' => $req->id,
                    'user_id' => $req->assignee_id,
                ], ['role' => 'assignee']);
            }

            $watcher = $users->reject(fn ($u) => $u->id === $req->assignee_id)->first();
            if ($watcher) {
                RequestParticipant::firstOrCreate([
                    'request_id' => $req->id,
                    'user_id' => $watcher->id,
                ], ['role' => 'watcher']);
            }
        });
    }
}
