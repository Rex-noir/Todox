import api from "@/api";
import { ApiResponse, Todo } from "@/interfaces/types";
import { addTodo, deleteTodo, updateTodo } from "@/stores/todox/actions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const todoServices = {
  delete: (id: string) => api.delete(`/todos/${id}`),
  getAll: (): Promise<Todo[]> => api.get("/todos"),
  getById: (id: string) => api.get(`/todos/${id}`),
  update: (id: string, todo: Partial<Todo>) => api.put(`/todos/${id}`, todo),
  create: (todo: Partial<Todo>): Promise<AxiosResponse<ApiResponse<Todo>>> =>
    api.post("/todos", todo),
};

export const useDeleteTodo = (id: string) => {
  return useMutation({
    mutationFn: () => todoServices.delete(id),
    onSuccess: () => {
      deleteTodo(id);
    },
  });
};

export const useGetAllTodo = () => {
  return useQuery({
    queryFn: todoServices.getAll,
    queryKey: ["todos"],
    retry: false,
  });
};

export const useGetTodo = (id: string) => {
  return useQuery({
    queryFn: () => todoServices.getById(id),
    queryKey: ["todo", id],
    retry: false,
  });
};

export const useUpdateTodo = (id: string, todo: Partial<Todo>) => {
  return useMutation({
    mutationFn: () => todoServices.update(id, todo),
    onSuccess: () => {
      updateTodo(id, todo);
    },
  });
};

export const useCreateTodo = () => {
  return useMutation({
    mutationFn: (todo: Partial<Todo>) => todoServices.create(todo),
    onSuccess: (data) => {
      addTodo(data.data.data);
    },
  });
};
