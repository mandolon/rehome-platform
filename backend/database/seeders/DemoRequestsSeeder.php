<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class DemoRequestsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        
        // Create some demo users
        $users = \App\Models\User::factory(10)->create();

        // Create demo requests
        $requests = \App\Models\Request::factory(20)->create([
            'creator_id' => fn() => $users->random()->id,
            'assignee_id' => fn() => $faker->optional(0.6)->passthrough($users->random()->id),
        ]);

        // Create participants for each request
        foreach ($requests as $request) {
            // Add creator as participant
            \App\Models\RequestParticipant::updateOrCreate(
                [
                    'request_id' => $request->id,
                    'user_id' => $request->creator_id,
                ],
                []
            );

            // Add assignee as participant if exists
            if ($request->assignee_id) {
                \App\Models\RequestParticipant::updateOrCreate(
                    [
                        'request_id' => $request->id,
                        'user_id' => $request->assignee_id,
                    ],
                    []
                );
            }

            // Add 2-4 additional participants
            $additionalParticipants = $users->random(rand(2, 4));
            foreach ($additionalParticipants as $user) {
                if ($user->id !== $request->creator_id && $user->id !== $request->assignee_id) {
                    \App\Models\RequestParticipant::updateOrCreate(
                        [
                            'request_id' => $request->id,
                            'user_id' => $user->id,
                        ],
                        []
                    );
                }
            }

            // Create 3-5 comments per request
            \App\Models\RequestComment::factory(rand(3, 5))->create([
                'request_id' => $request->id,
                'user_id' => fn() => $users->random()->id,
            ]);
        }
    }
}
