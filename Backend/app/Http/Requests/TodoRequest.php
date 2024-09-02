<?php

namespace App\Http\Requests;

use App\Models\Todo;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class TodoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $todoId = $this->route("todo");

        return match ($this->method()) {
            "POST" => Gate::allows("create", Todo::class),
            "PUT", "PATCH" => Gate::allows("update", Todo::findOrFail($todoId)),
            "DELETE" => Gate::allows("delete", Todo::findOrFail($todoId)),
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
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'completed' => 'nullable|boolean',
                'due_date' => 'nullable|date',
                'priority' => 'nullable|integer|min:0|max:10',
                'todoList_id' => 'nullable|integer|exists:todo_lists,id'
            ]
        };
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The title is required.',
            'title.string' => 'The title must be a string.',
            'title.max' => 'The title may not be greater than 255 characters.',
            'description.string' => 'The description must be a string.',
            'completed.boolean' => 'The completed field must be true or false.',
            'due_date.date' => 'The due date must be a valid date.',
            'priority.integer' => 'The priority must be an integer.',
            'priority.min' => 'The priority must be at least 0.',
            'priority.max' => 'The priority may not be greater than 10.',
            'todo_list_id.exists' => 'The selected todo list does not exist.',
        ];
    }
}
