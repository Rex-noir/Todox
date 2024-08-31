<?php

namespace App\Http\Requests;

use App\Models\TodoList;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class TodoListRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $todoListId = $this->route("todolist");

        return match ($this->method()) {
            "POST" => Gate::allows("create", TodoList::class),
            "PUT", "PATCH" => Gate::allows("update", TodoList::findOrFail($todoListId)),
            "DELETE" => Gate::allows("delete", TodoList::findOrFail($todoListId)),
            default => false,
        };
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return match ($this->method()) {
            "DELETE" => [],
            default => [
                "title" => ["required", "string", "max:255"],  // Title is required, must be a string and not exceed 255 characters
                "description" => ["nullable", "string"],  // Description is optional and must be a string if provided
                "project_id" => ["required", "exists:projects,id"],  // Project ID is required and must exist in the projects table
                "todo_id" => ["nullable", "exists:todos,id"],  // Todo ID is optional and must exist in the todos table if provided
                "tags" => ["nullable", "json"],  // Tags must be a valid JSON if provided
            ]
        };
    }
}
