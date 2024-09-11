<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\TodolistController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerifyEmailController;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return response()->json(['data' => $request->user()]);
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login'])->name('login');
    Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
})->middleware(['web']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('todos', TodoController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('todolists', TodolistController::class);

    Route::apiResource('users', UserController::class);
});


Route::prefix('email')->middleware('auth:sanctum')->group(function () {

    Route::get('/verify/{id}/{hash}', [VerifyEmailController::class, 'verifyEmail'])
        ->middleware('signed')
        ->name('verification.verify');

    Route::post('/verify/send', [VerifyEmailController::class, 'send'])
        ->middleware(middleware: 'throttle:6,1')
        ->name('verification.send');
});

Route::get("/verify/preview", function () {
    return (new VerifyEmail)->toMail((object) [])->render();
});