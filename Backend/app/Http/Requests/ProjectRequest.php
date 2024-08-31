<?php

namespace App\Http\Requests;

use App\Enums\ProjectStatus;
use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class ProjectRequest extends FormRequest
{

    /**
     * Indicates if the validator should stop on the first rule failure.
     *
     * @var bool
     */
    protected $stopOnFirstFailure = true;


    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $projectId = $this->route('project');

        return match ($this->method()) {
            "POST" => Gate::allows("create", Project::class),
            "PUT", "PATCH" => Gate::allows("update", Project::findOrFail($projectId)),
            'DELETE' => Gate::allows("delete", Project::findOrFail($projectId)),
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
        // No validation rules needed for DELETE requests
        return match ($this->method()) {
            'DELETE' => [],
            default => [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => [
                    'nullable',
                    'string',
                    'in:' . implode(',', array_column(ProjectStatus::cases(), 'value')),
                ],
                'iconColor' => 'nullable|string|max:7',
            ],
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
            'title.string' => 'The title must be a valid string.',
            'title.max' => 'The title may not be greater than 255 characters.',
            'description.string' => 'The description must be a valid string.',
            'status.string' => 'The status must be a valid string.',
            'status.in' => 'The selected status is invalid. Allowed values are: ' . implode(', ', array_column(ProjectStatus::cases(), 'value')) . '.',
            'iconColor.string' => 'The icon color must be a valid string.',
            'iconColor.max' => 'The icon color may not be greater than 7 characters.',
        ];
    }
}
