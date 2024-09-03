<?php

use App\Models\Project;
use App\Models\Todo;
use App\Models\TodoList;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;
use function PHPUnit\Framework\assertEquals;

uses(RefreshDatabase::class);

describe("API TEST", function () {
    describe("Create", function () {


        beforeEach(function () {
            $this->user = User::factory()->create();
            $this->project = Project::factory()->create();
            $this->todoList = TodoList::factory()->create();
            $this->todo = Todo::factory()->create();

            $this->sampleTodoList = [
                "title" => "Sample Todo List",
                "project_id" => $this->project->id,
                'tags' => json_encode(['urgent', 'low-priority']),
                'description' => 'This is a sample description.',
                "user_id" => $this->user->id,
            ];
        });

        it("can create a todoList", function () {
            actingAs($this->user);
            $response = postJson("/api/todolists/", $this->sampleTodoList);
            $response->assertStatus(201);

            $response->assertJson([
                'data' => [
                    "title" => $this->sampleTodoList['title'],
                    "project_id" => $this->sampleTodoList['project_id'],
                    "description" => $this->sampleTodoList['description'],
                ]
            ]);
        });

        it("cannot create a todoList without authentication ", function () {
            $response = postJson("/api/todolists/", $this->sampleTodoList);
            $response->assertStatus(401);
        });

        it("cannot create a todoList with invalid body", function () {
            actingAs($this->user);
            $response = postJson("/api/todolists", [
                "title" => 333
            ]);

            $response->assertStatus(422);
        });

        it("cannot create with project id which doesn't exist", function () {
            actingAs($this->user);
            $response = postJson("/api/todolists", [
                "title" => $this->sampleTodoList["title"],
                "description" => $this->sampleTodoList["description"],
                "project_id" => 393939,
            ]);
            $response->assertStatus(422);
        });
    });

    describe("READ", function () {
        beforeEach(function () {
            $this->user = User::factory()->create();
            $this->project = Project::factory()->create();
            TodoList::factory(10)->for($this->user)->create();
            $this->todoList = TodoList::factory()->for($this->user)->create();
            $this->todo = Todo::factory()->create();
            $this->todoListX = TodoList::factory()->create();

            $this->sampleTodoList = [
                "title" => "Sample Todo List",
                "project_id" => $this->project->id,
                "todoIds" => $this->todo->id,
                'tags' => json_encode(['urgent', 'low-priority']),
                'description' => 'This is a sample description.',
                "user_id" => $this->user->id,
            ];
        });

        it("can read all todolist by authenticated user", function () {
            actingAs($this->user);
            $response = getJson("/api/todolists");
            $response->assertStatus(200);
            $response->assertJsonCount(11, "data");
            $response->assertJsonStructure([
                "data" => [
                    "*" => [
                        "id",
                        "title",
                        "description",
                        "todoIds",
                        "project_id",
                        "tags",
                    ]
                ]
            ]);
        });

        it("cannot get todolists if not authenticated", function () {
            $response = getJson("/api/todolists");
            $response->assertStatus(401);
        });

        it("can get specified todoList by authenticated user", function () {

            actingAs($this->user);

            $response = getJson("/api/todolists/{$this->todoList->id}");
            $response->assertStatus(200);

            $response->assertJsonStructure([
                "data" => [
                    "id",
                    "title",
                    "description",
                    "todoIds",
                    "project_id",
                    "tags",
                ],
            ]);

            $responseData = $response->decodeResponseJson();
            assertEquals($this->todoList->id, $responseData['data']['id']);
        });

        it("cannot get todoList which isn't the user's", function () {
            actingAs($this->user);
            $response = getJson("/api/todolists/{$this->todoListX->id}");
            $response->assertStatus(403);
        });
    });

    describe("UPDATE", function () {
        beforeEach(function () {
            $this->user = User::factory()->create();
            $this->todoList = TodoList::factory()->for($this->user)->create();
            $this->todoListX = TodoList::factory()->create();
        });

        it("can update todoList of the users", function () {
            actingAs($this->user);
            $response = putJson("/api/todolists/{$this->todoList->id}", [
                "title" => "Updated here",
                "description" => "Updated again",
                "project_id" => $this->todoList->project_id
            ]);

            $response->assertStatus(204);
            assertDatabaseHas("todo_lists", [
                "title" => "Updated here",
                "description" => "Updated again"
            ]);
        });

        it("cannot update todoList unauthenticated", function () {
            $response = putJson("/api/todolists/{$this->todoList->id}", [
                "title" => "Updated here",
                "description" => "Updated again",
                "project_id" => $this->todoList->project_id
            ]);

            $response->assertStatus(401);
        });

        it("cannot update todoList which isn't the user's", function () {
            actingAs($this->user);
            $response = putJson("/api/todolists/{$this->todoListX->id}", [
                "title" => "TITLE"
            ]);

            $response->assertStatus(403);
        });
    });


    describe("DELETE", function () {

        beforeEach(function () {
            $this->user = User::factory()->create();
            $this->todoList = TodoList::factory()->for($this->user)->create();
            $this->todoListX = TodoList::factory()->create();
        });

        it("can delete the user's todoList", function () {
            actingAs($this->user);
            $response = deleteJson("/api/todolists/{$this->todoList->id}");
            $response->assertStatus(204);
        });

        it("cannot delete if not authenticated", function () {
            $response = deleteJson("/api/todolists/{$this->todoList->id}");
            $response->assertStatus(401);
        });

        it("cannot delete if not owner", function () {
            actingAs($this->user);
            $response = deleteJson("/api/todolists/{$this->todoListX->id}");
            $response->assertStatus(403);
        });
    });
});