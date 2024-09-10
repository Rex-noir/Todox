import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth/authStore";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CameraIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useUpdateUserMutation } from "@/services/userService";
import { cn } from "@/lib/utils";

export default function AccountView() {
  const user = useAuthStore((state) => state.user);

  const [username, setUsername] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isModified, setIsModified] = useState(false);

  const updateUserMutation = useUpdateUserMutation();

  useEffect(() => {
    const isDataModified =
      username !== user?.name ||
      email !== user.email ||
      newPassword !== "" ||
      currentPassword !== "";
    setIsModified(isDataModified);
  }, [username, email, newPassword, currentPassword, user?.name, user?.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate({
      id: user?.id,
      name: username,
      email: email,
      current_password: currentPassword,
      password: newPassword.length > 0 ? newPassword : undefined,
      password_confirmation: newPasswordConfirm.length
        ? newPasswordConfirm
        : undefined,
    });
  };

  const resetForms = () => {
    setUsername(user?.name ?? "");
    setEmail(user?.email ?? "");
    setNewPassword("");
    setNewPasswordConfirm("");
    setCurrentPassword("");
    setIsModified(false);
  };

  useEffect(() => {
    if (updateUserMutation.isSuccess) {
      setCurrentPassword("");
    }
  }, [updateUserMutation.isSuccess]);

  return (
    <Card className="mx-auto w-full max-w-2xl border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="relative space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {user?.name[0]}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              type="button"
              size="sm"
              className="flex items-center"
            >
              <CameraIcon className="mr-2 h-4 w-4" />
              Change Photo
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Change Password</h3>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                placeholder="Confirm new password"
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          <div className="flex flex-col space-y-2">
            <span className="text-sm text-destructive">
              Note : You need to enter your current password in order to change
              your account information.
            </span>
            <Label htmlFor="currentPassword" className="text-sm font-medium">
              * Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              className="w-full"
            />
          </div>

          {isModified && (
            <div className="sticky -bottom-2 z-20 flex w-full justify-end gap-3 rounded-md bg-white py-2">
              <Button
                onClick={resetForms}
                type="button"
                size="sm"
                className="flex items-center"
              >
                Cancel
              </Button>
              <Button
                disabled={!currentPassword || updateUserMutation.isPending}
                type="submit"
                size="sm"
                className={cn("flex items-center")}
              >
                <UpdateIcon
                  className={cn("mr-2 h-4 w-4", {
                    "animate-spin": updateUserMutation.isPending,
                  })}
                />
                Update Account
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
