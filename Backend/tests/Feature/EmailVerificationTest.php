<?php

use Database\Factories\UserFactory;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;

use function Pest\Laravel\actingAs;
use function PHPUnit\Framework\assertTrue;

uses(RefreshDatabase::class);

test("verification email is sent and logged", function () {

    Notification::fake();

    file_put_contents(storage_path('logs/laravel.log'), '');

    $user = UserFactory::new()->unverified()->create();
    $user1 = UserFactory::new()->unverified()->create();

    // Fake notifications to prevent actual sending
    Notification::fake();

    $user->sendEmailVerificationNotification();


    Notification::assertSentTo($user, VerifyEmail::class);
});


test("verification link is valid", function () {

    $user = UserFactory::new()->unverified()->create();
    $verificationURL = URL::temporarySignedRoute(
        "verification.verify",
        now()->addMinutes(10),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $response = actingAs($user)->getJson($verificationURL);
    $response->assertStatus(200);
    assertTrue($user->fresh()->hasVerifiedEmail());

});