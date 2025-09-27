<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RequestComment>
 */
class RequestCommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'request_id' => \App\Models\Request::factory(),
            'user_id' => \App\Models\User::factory(),
            'body' => $this->faker->paragraphs(2, true),
        ];
    }
}
