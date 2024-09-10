<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\putJson;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create a user with a specific password
    $this->user = User::factory()->create([
        'password' => Hash::make('password'), // Ensure password is hashed
    ]);
});

it('can update the user information', function () {
    // Authenticate as the user
    actingAs($this->user);

    // New data to update
    $updateData = [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'current_password' => 'password',
        'password' => 'newpassword',
        'password_confirmation' => 'newpassword',
    ];

    // Send PUT request to update user
    $response = putJson("/api/users/{$this->user->id}", $updateData);

    // Assert the response status
    $response->assertStatus(200);

    // Fetch the updated user from the database
    $this->user->refresh();

    // Assert the user data has been updated
    $this->assertEquals('Updated Name', $this->user->name);
    $this->assertEquals('updated@example.com', $this->user->email);
    $this->assertTrue(Hash::check('newpassword', $this->user->password));
});
