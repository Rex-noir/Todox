import api from "@/api";
import { defer } from "react-router-dom";
import Cookies from "js-cookie";

export const authRequired = () => {
  const sessionCookie = Cookies.get("auth-status");

  if (!sessionCookie) {
    return defer({
      user: Promise.reject("No session found"),
    });
  }
  const getUser = api.get("/user");

  return defer({
    user: getUser,
  });
};
