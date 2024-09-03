<?php

namespace Database\Factories;

use App\Enums\ProjectStatus;
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
        $user = User::factory()->create();
        return [
            //
            'title' => $this->faker->word(),
            'description' => $this->faker->sentence(3),
            'status' => $this->faker->randomElement(array_column(ProjectStatus::cases(), 'value')),
            'iconColor' => $this->faker->hexColor(),
            "user_id" => $user->id,
        ];
    }

    public function withUser(User $user): Factory
    {
        return $this->state([
            'user_id' => $user->id
        ]);
    }
}
