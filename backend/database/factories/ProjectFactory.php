<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-6 months', '+1 month');
        $endDate = fake()->dateTimeBetween($startDate, '+1 year');

        return [
            'name' => fake()->sentence(3),
            'description' => fake()->paragraph(3),
            'owner_id' => User::factory(),
            'status' => fake()->randomElement(['planned', 'active', 'paused', 'completed']),
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];
    }
}
