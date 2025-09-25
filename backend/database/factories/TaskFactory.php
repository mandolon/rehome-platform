<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(2),
            'project_id' => Project::factory(),
            'assignee_id' => fake()->boolean(70) ? User::factory() : null,
            'status' => fake()->randomElement(['redline', 'progress', 'completed']),
            'priority' => fake()->randomElement(['low', 'med', 'high']),
            'due_date' => fake()->boolean(80) ? fake()->dateTimeBetween('now', '+3 months') : null,
        ];
    }
}
