import { User } from "@/interfaces/types";
import api from "../api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { login, logout } from "@/stores/auth/actions";

interface LoginForm {
  email: string;
  password: string;
}

const authService = {
  login: (credentials: LoginForm): Promise<User> =>
    api.post(`/auth/login`, credentials),
  logout: () => api.post(`/auth/logout`),
  getCurrentUser: (): Promise<User> => api.get(`/user`),
};

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data);
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
    },
  });
};

export const useCurrentUser = (enabled: boolean = false) => {
  return useQuery({
    queryFn: authService.getCurrentUser,
    queryKey: ["currentUser"],
    retry: false,
    enabled: enabled,
  });
};
