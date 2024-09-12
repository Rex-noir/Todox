import { ApiResponse, User } from "@/interfaces/types";
import api from "../api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { login, logout } from "@/stores/auth/actions";
import { AxiosResponse } from "axios";

interface LoginForm {
  email: string;
  password: string;
  remember?:boolean;
}

const authService = {
  login: (credentials: LoginForm): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.post(`/auth/login`, credentials),
  logout: () => api.post(`/auth/logout`),
  getCurrentUser: (): Promise<User> => api.get(`/user`),
};

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.data.data);
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
