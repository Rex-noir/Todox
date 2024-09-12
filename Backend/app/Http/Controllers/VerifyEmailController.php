<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{

    public function verifyEmail(Request $request)
    {
        $user = User::find($request->route('id'));

        if ($request->route('id') != $user->getKey()) {
            throw new AuthorizationException;
        }

        if ($user->markEmailAsVerified())
            event(new Verified($user));

        return response()->json(['message' => "Verified successfully"], 200);
    }

    public function send(Request $request)
    {
        $request->user()->sendEmailVerificationNotification();

        return new JsonResponse(['message' => 'Verification link sent to ' . $request->user()->getEmailForVerification()], 200);
    }
}
