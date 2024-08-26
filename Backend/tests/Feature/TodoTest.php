<?php

use App\Models\Todo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\putJson;
use function PHPUnit\Framework\assertNull;

uses(RefreshDatabase::class);

describe("Without HTTP Requests", function () {

    it('can create a todo item', function () {
        /** @var User $user */
        $user = User::factory()->create();

        $todo = Todo::factory()->for($user)->create();

        assertDatabaseHas('todos', [
            'title' => $todo->title,
            'description' => $todo->description,
            'completed' => $todo->completed,
            'due_date' => $todo->due_date,
            'priority' => $todo->priority,
            'user_id' => $user->id,
        ]);

        expect($user->todos()->count())->toBe(1);

        expect($user->todos->first()->title)->toBe($todo->title);
    });

    it("can update todo item", function () {

        /** @var User $user */
        $user = User::factory()->create();

        $todo = Todo::factory()->for($user)->create();

        $updatedData = [
            'title' => "Updated title",
            'description' => "Updated description",
            'completed' => true,
            'priority' => 2,
        ];

        $todo->update($updatedData);

        assertDatabaseHas('todos', [
            'id' => $todo->id,
            'user_id' => $user->id,
            ...$updatedData
        ]);

        $updatedTodo = $todo->fresh();

        expect($updatedTodo)->title->toBe($updatedData['title'])
            ->description->toBe($updatedData['description'])
            ->completed->toBe($updatedData['completed'])
            ->priority->toBe($updatedData['priority']);
    });

    it('can delete todo item', function () {

        /** @var User $user */
        $user = User::factory()->create();

        $todo = Todo::factory()->for($user)->create();


        assertDatabaseHas('todos', ['id' => $todo->id]);

        $todo->delete();

        assertDatabaseMissing('todos', ['id' => $todo->id]);

        assertNull(Todo::find($todo->id));

        expect($user->todos()->count())->toBe(0);
    });
});

test("api for todos is defined", function () {

    /** @var User $user */
    $user = User::factory()->create();
    Todo::factory(10)->for($user)->create();

    $response = actingAs($user)
        ->get('/api/todos');

    $response->assertStatus(200);
    $response->assertJsonCount(10, 'data');
});

describe("With api Routes", function () {

    beforeEach(function () {
        /** @var User $this->user */
        $this->user = User::factory()->create();
        $this->todos = Todo::factory(10)->for($this->user)->create();
    });

    it("can index with authenticated users", function () {
        actingAs($this->user);
        $response = getJson('/api/todos');
        $response->assertStatus(200);
        $response->assertJsonCount(10, 'data');
    });

    it("cannot index with unauthenticated users", function () {

        $response = getJson('/api/todos');
        $response->assertUnauthorized();
    });


    it('Can update a todo with valid body', function () {

        $todo = $this->todos->first();
        $updatedData = [
            'title' => 'Updated Todo Title',
            'description' => 'Updated description',
            'completed' => true,
            'due_date' => '2023-12-31',
            'priority' => 2,
        ];

        $response = actingAs($this->user)->putJson("api/todos/{$todo->id}", $updatedData);

        $response->assertStatus(204);

        assertDatabaseHas('todos', [
            'id' => $todo->id,
            'title' => $updatedData['title'],
            'description' => $updatedData['description'],
            'completed' => $updatedData['completed'],
            'due_date' => $updatedData['due_date'],
            'priority' => $updatedData['priority'],
        ]);
    });

    it('Cannot update a todo with invalid body', function () {

        $todo = $this->todos->first();
        $updatedData = [
            'title' => null,
            'description' => 'Updated description',
            'completed' => "helloo",
            'due_date' => '2023-12-31',
            'priority' => "hi",
        ];

        $response = actingAs($this->user)->putJson("api/todos/{$todo->id}", $updatedData);

        $response->assertStatus(422);


    });

    it("Can delete a todo", function () {
        $todo = $this->todos->first();

        $response = actingAs($this->user)->delete("api/todos/{$todo->id}");

        $response->assertStatus(204);
    });

    it("Cannot delete a todo with unauthenticated user", function () {
        $todo = $this->todos->first();
        $response = deleteJson("api/todos/{$todo->id}");
        $response->assertStatus(401);
    });

    it("Can create a todo with valid body", function () {
        $todoData = [
            'title' => 'New Todo',
            'description' => 'New description',
            'completed' => false,
            'due_date' => '2023-12-31',
            'priority' => 1,
        ];

        $response = actingAs($this->user)->postJson("api/todos", $todoData);
        $response->assertStatus(201);
    });

    it("Cannot create a todo with invalid body", function () {
        $todoData = [
            'title' => null,
            'description' => 'New description',
            'completed' => false,
            'due_date' => '2023-12-31',
            'priority' => 1,
        ];
        $response = actingAs($this->user)->postJson("api/todos", $todoData);
        $response->assertStatus(422);
    });
});
