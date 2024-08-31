<?php

use App\Models\User;
use App\Models\Project;
use App\Enums\ProjectStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\patch;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

uses(RefreshDatabase::class);


describe("API Test", function () {

    describe("Create", function () {

        beforeEach(function () {
            /** @var User $this->user */
            $this->user = User::factory()->create();
            $this->project = Project::factory()->for($this->user)->create();
        });

        it("can create project with valid request", function () {
            actingAs($this->user);
            $response = postJson('/api/projects', [
                'title' => $this->project->title,
                'description' => $this->project->description,
                'status' => $this->project->status,
            ]);
            $response->assertStatus(201);
            assertDatabaseHas('projects', [
                'user_id' => $this->user->id,
                'id' => $this->project->id,
                'title' => $this->project->title,
                'description' => $this->project->description,
                'status' => $this->project->status,
            ]);
        });

        it('it cannot create project with invalid request', function () {
            actingAs($this->user);
            $response = postJson('/api/projects', [
                'title' => $this->project->title,
                'description' => 0,
            ]);
            $response->assertStatus(422);
        });

        it("doesn't allow unauthenticated user to create", function () {
            $response = postJson('/api/projects', [
                'title' => $this->project->title,
                'description' => 0,
            ]);
            $response->assertStatus(401);
        });
    });

    describe("Read", function () {
        beforeEach(function () {
            $this->user = User::factory()->create();
            $this->project = Project::factory(20)->for($this->user)->create();
            $this->projectU = Project::factory(10)->create();
            $this->sampleProject = Project::factory()->for($this->user)->create();
        });

        it("returns all projects by the user", function () {
            actingAs($this->user);
            $response = getJson("/api/projects");
            $response->assertStatus(200);
            $response->assertJsonCount(21, "data");
        });

        it("returns specified project detail", function () {
            actingAs($this->user);
            $response = getJson("/api/projects/{$this->sampleProject->id}");
            $response->assertStatus(200);
            $response->assertJsonCount(7, "data");
        });

        it("doesn't return if the user is not the owner", function () {
            $response = getJson("/api/projects/{$this->sampleProject->id}");
            $response->assertStatus(401);
        });
    });

    describe("Update", function () {
        beforeEach(function () {
            $this->user = User::factory()->create();
            $this->project = Project::factory()->for($this->user)->create();
            $this->projectX = Project::factory()->create();
        });

        it("can update project with authenticated user", function () {
            actingAs($this->user);
            $response = putJson("/api/projects/{$this->project->id}", [
                "title" => "Updated",
                "description" => "Description",
            ]);
            $response->assertStatus(204);
        });

        it("cannot update without authenticated user", function () {
            $response = putJson("/api/projects/{$this->project->id}", [
                "title" => "Updated",
                "description" => "Description",
            ]);
            $response->assertStatus(401);
        });

        it("cannot update project which isn't the user's", function () {
            actingAs($this->user);
            $response = putJson("/api/projects/{$this->projectX->id}", [
                "title" => "Updated",
                "description" => "Description",
            ]);
            $response->assertStatus(403);
        });
    });

    describe("Delete", function () {
        beforeEach(function () {
            $this->user = User::factory()->create();
            $this->project = Project::factory()->for($this->user)->create();
            $this->projectX = Project::factory()->create();
        });

        it("can delete project with authenticated user", function () {
            actingAs($this->user);
            $response = deleteJson("/api/projects/{$this->project->id}");
            $response->assertStatus(204);
        });

        it("cannot delete project which isn't the user's", function () {
            actingAs($this->user);
            $response = deleteJson("/api/projects/{$this->projectX->id}");
            $response->assertStatus(403);
        });
    });
});