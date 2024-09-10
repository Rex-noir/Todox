import api from "@/api";
import { ApiResponse, User } from "@/interfaces/types";
import { useAuthStore } from "@/stores/auth/authStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface UpdateUserRequest extends User {
  current_password: string;
  password?: string;
  password_confirmation?: string;
}

const userService = {
  updateUser: (
    updates: Partial<UpdateUserRequest>,
  ): Promise<AxiosResponse<ApiResponse<Partial<User>>>> =>
    api.put(`/users/${updates.id}`, { ...updates }),
};

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: userService.updateUser,
    onSuccess: (data) => {
      useAuthStore.getState().update(data.data.data);
    },
  });
};
