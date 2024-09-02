<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TodoList>
 */
class TodoListFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "title" => $this->faker->sentence(),
            "project_id" => Project::factory(),
            'tags' => json_encode($this->faker->randomElements(['urgent', 'low-priority', 'feature', 'bug'], rand(1, 3))),  // JSON encode the array
            'description' => $this->faker->paragraph(),
            "user_id" => User::factory(),
        ];
    }
}
