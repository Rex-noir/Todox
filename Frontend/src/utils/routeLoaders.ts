import api from "@/api";
import { defer, redirect } from "react-router-dom";

export const authRequired = () => {
  const getUser = api.get("/user");

  return defer({
    user: getUser,
  });
};

export const authBlock = () => {
  return api
    .get("/user")
    .then(() => redirect("/app"))
    .catch(() => null);
};
