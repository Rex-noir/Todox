<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Allow all users to make this request
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'], // Email must be a valid email format and is required
            'password' => ['required', 'string', 'min:8'], // Password must be at least 8 characters long and is required
            'remember' => ['nullable', 'boolean'], // Remember me is optional and must be a boolean if provided
        ];
    }

    /**
     * Get the custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'The email field is required.', // Custom message for missing email
            'email.email' => 'Please enter a valid email address.', // Custom message for invalid email format
            'email.max' => 'The email may not be greater than 255 characters.', // Custom message for email length
            'password.required' => 'The password field is required.', // Custom message for missing password
            'password.string' => 'The password must be a string.', // Custom message for non-string password
            'password.min' => 'The password must be at least 8 characters.', // Custom message for short password
            'remember.boolean' => 'The remember me field must be true or false.', // Custom message for invalid remember me value
        ];
    }
}
