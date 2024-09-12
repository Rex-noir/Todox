import api from "@/api";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/interfaces/types";
import { useAuthStore } from "@/stores/auth/authStore";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Verify() {
  const [verificationStatus, setVerificationStatus] = useState("pending");

  const urlParams = new URLSearchParams(window.location.search);
  const verifyUrl = urlParams.get("verify_url");
  const navigate = useNavigate();

  const user = useAuthStore().user;

  const verifyEmail = async (url: string) => {
    try {
      const response = await api.get(url);
      if (response.status === 200) {
        setVerificationStatus("success");
      } else {
        setVerificationStatus("error");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationStatus("error");
    }
  };

  useEffect(() => {
    if (verificationStatus === "success") {
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  }, [verificationStatus, navigate]);

  if (user) {
    navigate("/");
    return;
  }

  if (verifyUrl) {
    verifyEmail(verifyUrl);
  } else {
    return <VerifyEmail />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {verificationStatus === "pending" && <p>Verifying your email...</p>}
      {verificationStatus === "success" && (
        <>
          <p>Your email has been verified successfully! </p>
          <p>You will be redirected to home page in 5 seconds.</p>
        </>
      )}
      {verificationStatus === "error" && (
        <p>Email verification failed. Please try again.</p>
      )}
    </div>
  );
}

const VerifyEmail = () => {
  const user = useAuthStore().user;
  const [isThrottled, setIsThrottled] = useState(true);
  const [countdown, setCountdown] = useState(60); // Adjust for desired throttling duration

  const resend = async () => {
    if (isThrottled || !user?.email) {
      return; // Prevent multiple requests while throttled
    }

    try {
      const response = (await api.post("/email/verify/send")) as ApiResponse;
      setIsThrottled(true);
      setCountdown(60);
      toast.success(response.message);
    } catch (error) {
      if (isAxiosError(error) && error.response?.data.message) {
        toast.error(error.response?.data.message);
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isThrottled) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => Math.max(0, prevCountdown - 1));

        if (countdown === 0) {
          clearInterval(interval);
          setIsThrottled(false);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isThrottled, countdown]); // Dependency array ensures effect runs only when isThrottled changes

  return (
    <>
      <div className="flex h-full min-h-screen flex-col items-center justify-center gap-2 text-center">
        <p>Email verification has been sent.</p>

        {user && (
          <>
            {" "}
            <p className="text-sm text-muted-foreground text-yellow-500">
              If you didn't receive the email, please click the button below to
              resend the verification.
            </p>
            <Button
              className="m-3.5"
              size="sm"
              variant="destructive"
              disabled={isThrottled}
              onClick={resend}
            >
              {isThrottled ? `Resend (${countdown} seconds)` : "Resend"}
            </Button>
          </>
        )}
      </div>
    </>
  );
};
