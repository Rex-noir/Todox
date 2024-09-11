<?php

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;
use function Pest\Laravel\withMiddleware;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function PHPUnit\Framework\assertEquals;

uses(RefreshDatabase::class);

test("web-login using credentials", function () {

    $user = User::factory()->create(['email' => "test@example.com", 'password' => "password"]);

    $response = withMiddleware('web')->postJson(
        uri: '/api/auth/login',
        data: ['email' => $user->email, 'password' => 'password'],
        headers: ['Accept' => 'application/json']
    );

    $response->assertOk();
});

test("web-login using wrong credentials", function () {
    $response = postJson(
        uri: '/api/auth/login',
        data: ['email' => "test@example.com", 'password' => 'wrong_password'],
        headers: ['Accept' => 'application/json']
    );
    $response->assertUnauthorized();
});

test("web-register with valid information", function () {
    $response = postJson(
        uri: "/api/auth/register",
        data: [
            "name" => "test",
            "email" => "test@gmail.com",
            "password" => "12345678",
            "password_confirmation" => "12345678",
        ],
        headers: [
            "Accept" => "application/json"
        ]
    );

    $response->assertStatus(201);

    $currentUser = Auth::user();
    $expectedUser = User::where('email', 'test@gmail.com')->first();

    assertEquals($expectedUser->id, $currentUser->id);

});

test("Register event is dispatched", function () {

    Event::fake([Registered::class]);

    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password'
    ];

    $result = postJson('/api/auth/register', $userData);
    Event::assertDispatched(Registered::class);
});

test("web-register with invalid information", function () {
    $response = postJson(
        uri: "/api/auth/register",
        data: [
            "name" => "test",
            "email" => "test@gmail.com",
            "password" => "12345",
            "password_confirmation" => "12345678",
        ],
        headers: [
            "Accept" => "application/json"
        ]
    );

    $response->assertStatus(422);
});

// New test for logout route
test("web-logout successfully", function () {

    /** @var \App\Models\User $user */
    $user = User::factory()->create(['email' => "test@example.com", 'password' => "password"]);

    $loginResponse = withMiddleware('web')->postJson(
        uri: '/api/auth/login',
        data: ['email' => $user->email, 'password' => 'password'],
        headers: ['Accept' => 'application/json']
    );

    $loginResponse->assertOk();

    // Assuming you have authentication middleware for logged-in users
    $response = actingAs($user)->postJson('/api/auth/logout');

    $response->assertOk();
});

test("can get user detail", function () {

    /** @var \App\Models\User $user */
    $user = User::factory()->create();

    actingAs($user);

    $response = getJson(uri: "/api/user");

    $response->assertOk();
});