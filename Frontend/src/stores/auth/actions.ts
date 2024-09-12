import { User } from "@/interfaces/types";
import { useAuthStore } from "./authStore";
import Cookies from "js-cookie";

const SESSION_LIFETIME_MINUTES = 120; // Matching Laravel's SESSION_LIFETIME

export const login = (user: User) => {
  useAuthStore.setState((state) => {
    state.user = user;
    state.isAuthenticated = true;

    if (user.remember === true) {
      // For "remember me", set a long-lived cookie
      Cookies.set("auth-status", "authenticated", { expires: 365 }); // 1 year
    } else if (user.remember === false) {
      const expirationTime = new Date(
        new Date().getTime() + SESSION_LIFETIME_MINUTES * 60 * 1000,
      );
      Cookies.set("auth-status", "authenticated", { expires: expirationTime });
    }
  });
};

export const logout = () => {
  useAuthStore.setState((state) => {
    state.isAuthenticated = false;
    state.user = null;

    Cookies.remove("auth-status");
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
