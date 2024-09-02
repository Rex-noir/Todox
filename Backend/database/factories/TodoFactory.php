<?php

namespace Database\Factories;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Todo>
 */
class TodoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::factory()->create();

        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'completed' => $this->faker->boolean(),
            'due_date' => $this->faker->date(),
            'priority' => $this->faker->randomDigit(),
            'user_id' => $user->id
        ];
    }

    public function withUser(User $user): Factory
    {
        return $this->state([
            'user_id' => $user->id
        ]);
    }

    public function dueToday(): Factory
    {
        return $this->state(
            function (array $attributes) {
                return [
                    'due_date' => Carbon::today()->format('Y-m-d'),
                ];
            }
        );
    }
}
