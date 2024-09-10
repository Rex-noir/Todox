<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;

describe("Password Change", function () {
    beforeEach(function () {
        /** @var User $user */
        $this->user = User::factory()->create(['password' => 'password']);
    });

    it("can change password with valid credentials", function () {
        actingAs($this->user);
        $result = postJson("/api/password/change", [
            'current_password' => 'password',
            'password' => 'newPassword',
            'password_confirmation' => 'newPassword'
        ]);

        $result->assertStatus(200);
        $result->assertJson(['message' => 'Password changed successfully']);

        $this->user->refresh();

        expect(Hash::check('newPassword', $this->user->password))->toBeTrue();
        expect(Hash::check('password', $this->user->password))->toBeFalse();

    });

    it("cannot change with unauthorized user",function(){
        $result = postJson("/api/password/change", [
            'current_password' => 'password',
            'password' => 'newPassword',
            'password_confirmation' => 'newPassword'
        ]);

        $result->assertStatus(401);
    });

    it("cannot change with invalid current password",function (){
        actingAs($this->user);

        $result = postJson("/api/password/change",[
            'current_password' => 'invalidPassword',
            'password' => 'newPassword',
            'password_confirmation' => 'newPassword'
        ]);
        $result->assertStatus(400);
    });
});