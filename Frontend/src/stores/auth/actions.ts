import { User } from "@/interfaces/types";
import { useAuthStore } from "./authStore";
import Cookies from "js-cookie";

export const login = (user: User) => {
  useAuthStore.setState((state) => {
    state.user = user;
    state.isAuthenticated = true;

    const twoHoursFromNow = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);

    if (user.remember) {
      Cookies.set("todox-session", "remember", { expires: Infinity });
    } else {
      Cookies.set("todox-session", "session", { expires: twoHoursFromNow });
    }
  });
};

export const logout = () => {
  useAuthStore.setState((state) => {
    state.isAuthenticated = false;
    state.user = null;

    Cookies.remove("todox-session");
  });
};

export const setUser = (user: User) => {
  useAuthStore.setState((state) => {
    state.user = user;
  });
};

export const isAuthenticated = () => {
  return useAuthStore.getState().isAuthenticated;
};

export const getUser = () => {
  return useAuthStore.getState().user;
};
