<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

test("web-register with valid information", function () {
    $response = postJson(
        uri: "/register",
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
});

test("web-register with invalid information", function () {
    $response = postJson(
        uri: "/register",
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
