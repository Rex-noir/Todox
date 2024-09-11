<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{

    public function verifyEmail(\Illuminate\Foundation\Auth\EmailVerificationRequest $request)
    {
        $request->fulfill();
        return response()->json(['message' => "Verified successfully"], 200);
    }

    public function send(Request $request)
    {
        $request->user()->sendEmailVerificationNotification();

        return new JsonResponse(['message' => 'Verification link sent to ' . $request->user()->getEmailForVerification()], 200);
    }
}
