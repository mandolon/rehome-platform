<?php

namespace Database\Factories;

use App\Models\RequestComment;
use App\Models\Request;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RequestComment>
 */
class RequestCommentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = RequestComment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'request_id' => Request::factory(),
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'body' => $this->faker->randomElement([
                $this->faker->sentence(10),
                $this->faker->paragraphs(2, true),
                $this->faker->sentences(3, true),
            ]),
            'created_at' => $this->faker->dateTimeBetween('-14 days', 'now'),
            'updated_at' => function (array $attributes) {
                return $this->faker->dateTimeBetween($attributes['created_at'], 'now');
            },
        ];
    }
}