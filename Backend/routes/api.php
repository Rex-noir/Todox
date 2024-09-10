<?php

use App\Http\Controllers\PasswordController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\TodolistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
    Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
})->middleware(['web']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('todos', TodoController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('todolists', TodolistController::class);

    Route::post("/password/change", [PasswordController::class, 'changePassword'])->middleware('auth:sanctum');
});
