<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle a login request to the application
     * @param \App\Http\Requests\LoginRequest $request
     * @return void
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->only("email", "password");
        $remember = $request->boolean("remember", false);

        if (Auth::attempt($credentials, $remember)) {
            session()->regenerate();

            $userData = Auth::user();
            $userData['remember'] = $remember;
            return response()->json([
                'message' => "Login successful.",
                'data' => $userData,
            ], 200);
        }

        return response()->json([
            'message' => "Invalid credentials.",
        ], 401);

    }

    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        Auth::login($user);

        session()->regenerate();

        event(new Registered($user));

        return response()->json([
            'message' => "Registration successful!",
            "data" => Auth::user(),
        ], 201);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        session()->invalidate();
        session()->regenerateToken();

        return response()->json([
            'message' => "Logout successful.",
        ], 200);
    }
}
