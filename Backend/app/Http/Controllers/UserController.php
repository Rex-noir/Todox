<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->name = $request->validated("name", $user->name);
        $user->email = $request->validated("email", $user->email);

        if ($request->filled("password")) {
            $user->password = Hash::make($request->password);
            event(new PasswordReset($user));
        }

        $user->save();

        $changes = $user->getChanges();
        unset($changes['password']); // Remove password from the changes array

        return response()->json(['message' => 'User updated successfully', 'data' => $changes], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
