<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    //
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => ['required', 'confirmed', Password::defaults()]
        ]);

        /** @var User $user */
        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'The provided password does not match your current password'], 400);
        }

        $this->resetPassword($user, $request->password);
        return response()->json(['message' => 'Password changed successfully'], 200);
    }

    public function resetPassword(User $user, string $password)
    {
        $user->password = Hash::make($password);

        $user->save();

        event(new PasswordReset($user));

    }
}
