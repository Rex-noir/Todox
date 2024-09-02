import { User } from "@/interfaces/types";
import { useAuthStore } from "./authStore";

export const login = (user: User) => {
  useAuthStore.setState((state) => {
    state.user = user;
    state.isAuthenticated = true;
  });
};

export const logout = () => {
  useAuthStore.setState((state) => {
    state.isAuthenticated = false;
    state.user = null;
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
