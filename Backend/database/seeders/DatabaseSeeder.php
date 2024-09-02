<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Todo;
use App\Models\TodoList;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Project::factory(rand(4, 10))->for($user)->create()->each(function (Project $project) use ($user) {
            TodoList::factory(rand(1, 10))
                ->for($project)
                ->for($user)
                ->create()
                ->each(function (TodoList $todoList) use ($user) {
                    Todo::factory(rand(1, 10))
                        ->for($todoList)
                        ->for($user)
                        ->create();

                    Todo::factory()->dueToday()->withUser($user)->create();
                });
        });
    }
}
