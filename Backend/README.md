# Todox API Application Documentation

![Todox Logo](/images/icon.svg)

## Table of Contents

1. [Introduction](#introduction)
2. [Form Requests](#form-requests)
3. [Routes](#routes)
4. [Controllers](#controllers)
5. [API Endpoints](#api-endpoints)

## 1. Introduction

This documentation covers the application's structure, form requests, routes, controllers, and API endpoints.

## 2. Form Requests

### LoginRequest

-   **File**: `App\Http\Requests\LoginRequest`
-   **Purpose**: Validates user login data
-   **Rules**:
    -   `email`: Required, valid email format, max 255 characters
    -   `password`: Required, string, minimum 8 characters
    -   `remember`: Optional, boolean
-   **Custom Messages**: Provides user-friendly error messages for validation failures

### RegisterRequest

-   **File**: `App\Http\Requests\RegisterRequest`
-   **Purpose**: Validates user registration data
-   **Rules**:
    -   `name`: Required, string, max 255 characters
    -   `email`: Required, valid email format, max 255 characters, unique in users table
    -   `password`: Required, string, minimum 8 characters, must be confirmed
-   **Custom Messages**: Provides user-friendly error messages for validation failures

### ProjectRequest

-   **File**: `App\Http\Requests\ProjectRequest`
-   **Purpose**: Validates project creation and update data
-   **Authorization**: Checks user permissions for create, update, and delete actions
-   **Rules**:
    -   `title`: Required, string, max 255 characters
    -   `description`: Optional, string
    -   `status`: Optional, string, must be a valid ProjectStatus enum value
    -   `iconColor`: Optional, string, max 7 characters
-   **Custom Messages**: Provides user-friendly error messages for validation failures

### TodoListRequest

-   **File**: `App\Http\Requests\TodoListRequest`
-   **Purpose**: Validates todo list creation and update data
-   **Authorization**: Checks user permissions for create, update, and delete actions
-   **Rules**:
    -   `title`: Required, string, max 255 characters
    -   `description`: Optional, string
    -   `project_id`: Required, must exist in projects table
    -   `todo_id`: Optional, must exist in todos table
    -   `tags`: Optional, must be valid JSON
-   **Custom Messages**: Provides user-friendly error messages for validation failures

### TodoRequest

-   **File**: `App\Http\Requests\TodoRequest`
-   **Purpose**: Validates todo item creation and update data
-   **Authorization**: Checks user permissions for create, update, and delete actions
-   **Rules**:
    -   `title`: Required, string, max 255 characters
    -   `description`: Optional, string
    -   `completed`: Optional, boolean
    -   `due_date`: Optional, valid date
    -   `priority`: Optional, integer between 0 and 10
    -   `todoList_id`: Optional, must exist in todo_lists table
-   **Custom Messages**: Provides user-friendly error messages for validation failures

## 3. Routes

The application defines the following routes:

### Authentication Routes

```php
Route::prefix('auth')->group(function () {
    Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
    Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
})->middleware(['web']);
```

### API Routes

All API routes are protected by the `auth:sanctum` middleware.

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('todos', TodoController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('todolists', TodolistController::class);
});
```

## 4. Controllers

### AuthController

Handles user authentication operations.

-   **Methods**:
    -   `login(LoginRequest $request)`: Authenticates a user
    -   `register(RegisterRequest $request)`: Registers a new user
    -   `logout(Request $request)`: Logs out the authenticated user

### ProjectController

Manages CRUD operations for projects.

-   **Methods**:
    -   `index()`: Lists all projects for the authenticated user
    -   `store(ProjectRequest $request)`: Creates a new project
    -   `show(string $id)`: Displays a specific project
    -   `update(ProjectRequest $request, string $id)`: Updates a specific project
    -   `destroy(ProjectRequest $request, string $id)`: Deletes a specific project

### TodolistController

Manages CRUD operations for todo lists.

-   **Methods**:
    -   `index()`: Lists all todo lists for the authenticated user
    -   `store(TodoListRequest $request)`: Creates a new todo list
    -   `show(string $id)`: Displays a specific todo list
    -   `update(TodoListRequest $request, string $id)`: Updates a specific todo list
    -   `destroy(TodoListRequest $request, string $id)`: Deletes a specific todo list

### TodoController

Manages CRUD operations for todo items.

-   **Methods**:
    -   `index()`: Lists all todos for the authenticated user
    -   `store(TodoRequest $request)`: Creates a new todo item
    -   `show(string $id)`: Displays a specific todo item (not implemented)
    -   `update(TodoRequest $request, string $id)`: Updates a specific todo item
    -   `destroy(TodoRequest $request, string $id)`: Deletes a specific todo item

## 5. API Endpoints

### Authentication

-   `POST /auth/login`: Log in a user
-   `POST /auth/register`: Register a new user
-   `POST /auth/logout`: Log out the authenticated user

### Projects

-   `GET /projects`: List all projects
-   `POST /projects`: Create a new project
-   `GET /projects/{id}`: Get a specific project
-   `PUT/PATCH /projects/{id}`: Update a specific project
-   `DELETE /projects/{id}`: Delete a specific project

### Todo Lists

-   `GET /todolists`: List all todo lists
-   `POST /todolists`: Create a new todo list
-   `GET /todolists/{id}`: Get a specific todo list
-   `PUT/PATCH /todolists/{id}`: Update a specific todo list
-   `DELETE /todolists/{id}`: Delete a specific todo list

### Todos

-   `GET /todos`: List all todos
-   `POST /todos`: Create a new todo
-   `GET /todos/{id}`: Get a specific todo (not implemented)
-   `PUT/PATCH /todos/{id}`: Update a specific todo
-   `DELETE /todos/{id}`: Delete a specific todo

### Email Verification

-   `GET /email/verify/{id}/{hash}`: Verify a user's email address
-   `POST /email/verify/send`: Send a new email verification notification

Note: All API endpoints (except authentication and email verification not including the 'send' endpoints) require authentication using Laravel Sanctum.

Note: Don't forget to set up your database connection in the `.env` file and run the necessary migrations and seeders.
Note : Don't forget to set up your own email configuration in the `.env` file for email verification.
