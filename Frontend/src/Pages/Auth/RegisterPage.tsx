import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/services/authService";
import { useEffect, useState } from "react";
import { TbLoaderQuarter } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [remember, setRemember] = useState(false);

  const register = useRegister();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register.mutateAsync({
        email,
        name,
        password,
        password_confirmation: passwordConfirmation,
        remember,
      });

      navigate("/auth/verify");
    } catch {
      return {};
    }
  };

  useEffect(() => {
    if (register.isSuccess) {
      resetForm();
    }
  }, [register.isSuccess]);

  const resetForm = () => {
    setEmail("");
    setName("");
    setPassword("");
    setPasswordConfirmation("");
    setRemember(false);
  };

  return (
    <div className="mx-auto grid min-w-[300px] gap-6">
      <div className="grid gap-2 text-center">
        <p className="text-balance text-muted-foreground">Register account</p>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="John Doe"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password-confirmation">Password Confirmation</Label>
          <Input
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            id="password-confirmation"
            type="password"
            required
          />
        </div>
        <div className="mb-2 flex gap-2">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(e) => setRemember(e as boolean)}
          />
          <Label htmlFor="remember">Remember me</Label>
        </div>
        <Button disabled={register.isPending} type="submit" className="w-full">
          {register.isPending ? (
            <TbLoaderQuarter className="animate-spin" />
          ) : (
            "Register"
          )}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link to="/auth/login" className="underline">
          Login
        </Link>
      </div>
    </div>
  );
}
