import api from "@/api";
import { defer } from "react-router-dom";

export const authRequired = () => {
  const getUser = api.get("/user");

  return defer({
    user: getUser,
  });
};
