<?php

use App\Models\Todo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;
use function PHPUnit\Framework\assertNull;

uses(RefreshDatabase::class);

describe("API TEST for Todos", function () {

    describe("CREATE", function () {

        beforeEach(function () {
            /** @var User $this->user */
            $this->user = User::factory()->create();
            $this->todos = Todo::factory(10)->for($this->user)->create();
        });


        it("can create a todo with valid body", function () {
            $todoData = [
                'title' => 'New Todo',
                'description' => 'New description',
                'completed' => false,
                'due_date' => '2023-12-31',
                'priority' => 1,
            ];

            actingAs($this->user);
            $response = postJson("/api/todos", $todoData);
            $response->assertStatus(201);

            assertDatabaseHas('todos', [
                'title' => $todoData['title'],
                'description' => $todoData['description'],
                'completed' => $todoData['completed'],
                'due_date' => $todoData['due_date'],
                'priority' => $todoData['priority'],
                'user_id' => $this->user->id,
            ]);
        });

        it("cannot create a todo with invalid body", function () {
            $todoData = [
                'title' => null,
                'description' => 'New description',
                'completed' => false,
                'due_date' => '2023-12-31',
                'priority' => 1,
            ];

            actingAs($this->user);
            $response = postJson("/api/todos", $todoData);
            $response->assertStatus(422);
        });
    });

    describe("READ", function () {

        beforeEach(function () {
            /** @var User $this->user */
            $this->user = User::factory()->create();
            $this->todos = Todo::factory(10)->for($this->user)->create();
        });


        it("can index todos for authenticated user", function () {
            actingAs($this->user);
            $response = getJson("/api/todos");
            $response->assertStatus(200);
            $response->assertJsonCount(10, 'data');
        });

        it("cannot index todos for unauthenticated user", function () {
            $response = getJson("/api/todos");
            $response->assertUnauthorized();
        });
    });

    describe("UPDATE", function () {

        beforeEach(function () {
            /** @var User $this->user */
            $this->user = User::factory()->create();
            $this->todos = Todo::factory(10)->for($this->user)->create();
        });


        it('can update a todo with valid body', function () {
            $todo = $this->todos->first();
            $updatedData = [
                'title' => 'Updated Todo Title',
                'description' => 'Updated description',
                'completed' => true,
                'due_date' => '2023-12-31',
            ];

            actingAs($this->user);
            $response = putJson("/api/todos/{$todo->id}", $updatedData);
            $response->assertStatus(200);
            $response->assertJson([
                'data' => [
                    'title' => 'Updated Todo Title',
                    'description' => 'Updated description',
                    'completed' => true,
                    'due_date' => '2023-12-31',
                ]
            ]);

            assertDatabaseHas('todos', [
                'id' => $todo->id,
                ...$updatedData
            ]);
        });

        it('cannot update a todo with invalid body', function () {
            $todo = $this->todos->first();
            $invalidData = [
                'title' => null,
                'description' => 'Updated description',
                'completed' => "helloo",
                'due_date' => '2023-12-31',
                'priority' => "hi",
            ];

            actingAs($this->user);
            $response = putJson("/api/todos/{$todo->id}", $invalidData);
            $response->assertStatus(422);
        });
    });

    describe("DELETE", function () {

        beforeEach(function () {
            /** @var User $this->user */
            $this->user = User::factory()->create();
            $this->todos = Todo::factory(10)->for($this->user)->create();
        });


        it("can delete a todo", function () {
            $todo = $this->todos->first();

            actingAs($this->user);
            $response = deleteJson("/api/todos/{$todo->id}");
            $response->assertStatus(204);

            assertDatabaseMissing('todos', ['id' => $todo->id]);
            assertNull(Todo::find($todo->id));
        });

        it("cannot delete a todo for unauthenticated user", function () {
            $todo = $this->todos->first();
            $response = deleteJson("/api/todos/{$todo->id}");
            $response->assertStatus(401);
        });
    });
});
