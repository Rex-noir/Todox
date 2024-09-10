<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->route("user");

        return match ($this->method()) {
            "POST" => Gate::allows("create", User::class),
            "PUT", "PATCH" => Gate::allows("update", $user),
            "DELETE" => Gate::allows("delete", $user),
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
        $user = $this->route("user");
        return [
            //
            "name" => ['sometimes', 'string', 'max:255'],
            "email" => ['sometimes', 'email', 'unique:users,email,' . $user->id],
            'current_password' => ['required', 'string'],
            'password' => ['sometimes', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()]
        ];
    }

    public function withValidators(Validator $validator)
    {
        $validator->after(function ($validator) {
            if (!$this->checkCurrentPassword()) {
                $validator->errors()->add('current_password', 'The provided password does not match your current password.');
            }
        });
    }

    protected function checkCurrentPassword()
    {
        return Hash::check($this->input('current_password'), Auth::user()->password);
    }
}
