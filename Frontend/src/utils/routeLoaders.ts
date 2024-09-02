import api from "@/api";
import { isAuthenticated, setUser } from "@/stores/auth/actions";
import { defer } from "react-router-dom";

export const authRequired = () => {
  return defer({
    authStatus: (async () => {
      const status = isAuthenticated();
      if (!status) {
        const res = await api.get("/user");
        setUser(res.data);
        return true;
      }
      return true;
    })(),
  });
};
