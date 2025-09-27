<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Request>
 */
class RequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['open', 'in_progress', 'blocked', 'resolved', 'closed'];
        
        return [
            'title' => $this->faker->sentence(6),
            'body' => $this->faker->paragraphs(3, true),
            'status' => $this->faker->randomElement($statuses),
            'creator_id' => \App\Models\User::factory(),
            'assignee_id' => $this->faker->optional(0.7)->passthrough(\App\Models\User::factory()),
        ];
    }
}
