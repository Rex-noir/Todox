<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

test("web-login using credentials", function () {

    $user = User::factory()->create(['email' => "test@example.com", 'password' => "password"]);

    $response = postJson(
        uri: '/login',
        data: ['email' => $user->email, 'password' => 'password'],
        headers: ['Accept' => 'application/json']
    );

    $response->assertOk();
});


test("web-login using wrong credentials", function () {
    $response = postJson(
        uri: '/login',
        data: ['email' => "test@example.com", 'password' => 'wrong_password'],
        headers: ['Accept' => 'application/json']
    );
    $response->assertUnprocessable();
});
