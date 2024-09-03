import api from "@/api";
import { ApiResponse, Todo } from "@/interfaces/types";
import { addTodo, deleteTodo, updateTodo } from "@/stores/todox/actions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const todoServices = {
  delete: (id: string) => api.delete(`/todos/${id}`),
  getAll: (): Promise<AxiosResponse<ApiResponse<Todo[]>>> => api.get("/todos"),
  getById: (id: string) => api.get(`/todos/${id}`),
  update: (
    todo: Partial<Todo>,
  ): Promise<AxiosResponse<ApiResponse<Partial<Todo>>>> =>
    api.put(`/todos/${todo.id}`, todo),
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

export const useGetAllTodo = (enable: boolean) => {
  return useQuery({
    queryFn: todoServices.getAll,
    queryKey: ["todos"],
    retry: false,
    select: (data) => data.data.data,
    enabled: enable,
  });
};

export const useGetTodo = (id: string) => {
  return useQuery({
    queryFn: () => todoServices.getById(id),
    queryKey: ["todo", id],
    retry: false,
  });
};

export const useUpdateTodo = (id: string) => {
  return useMutation({
    mutationFn: (todo: Partial<Todo>) => todoServices.update(todo),
    onSuccess: (data) => {
      updateTodo(id, data.data.data);
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
