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
}
