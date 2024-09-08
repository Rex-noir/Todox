import { LuLoader2, LuLogOut } from "react-icons/lu";
import { Button } from "../ui/button";
import { useLogout } from "@/services/authService";
import { Navigate } from "react-router-dom";

export default function LogoutButton() {
  const logOutMutation = useLogout();

  const handleLogout = () => {
    logOutMutation.mutate();
  };

  if (logOutMutation.isSuccess) {
    return <Navigate to={"/auth/login"} />;
  }

  return (
    <div>
      <Button onClick={handleLogout} variant={"ghost"}>
        {logOutMutation.isIdle && <LuLogOut className="size-5" />}
        {logOutMutation.isPending && (
          <LuLoader2 className="size-5 animate-spin" />
        )}
      </Button>
    </div>
  );
}
