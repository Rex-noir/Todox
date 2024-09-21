<?php

namespace App\Actions;

use App\Models\User;

class CreateTokens
{
    static function create(User $user, bool $refreshToken = false): string
    {
        $expiration = $refreshToken ? now()->addMonth() : now()->addMinutes(30);
        $ability = $refreshToken ? 'issue' : 'access';
        return $user->createToken('token', [$ability], $expiration)->plainTextToken;
    }
}
