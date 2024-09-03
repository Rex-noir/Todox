import api from "@/api";
import { ApiResponse, TodoList } from "@/interfaces/types";
import {
  addTodoList,
  deleteTodoList,
  updateTodoList,
} from "@/stores/todox/actions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const todoListServices = {
  delete: (id: string) => api.delete(`/todolists/${id}`),
  getAll: (): Promise<AxiosResponse<ApiResponse<TodoList[]>>> =>
    api.get("/todolists"),
  getById: (id: string): Promise<TodoList> => api.get(`/todolists/${id}`),
  update: (id: string, todoList: Partial<TodoList>) =>
    api.put(`/todolists/${id}`, todoList),
  create: (
    todoList: Partial<TodoList>,
  ): Promise<AxiosResponse<AxiosResponse<TodoList>>> =>
    api.post("/todolists", todoList),
};

export const useDeleteTodoList = (id: string) => {
  return useMutation({
    mutationFn: () => todoListServices.delete(id),
    onSuccess: () => {
      deleteTodoList(id);
    },
  });
};

export const useGetAllTodoList = (enable: boolean) => {
  return useQuery({
    queryFn: todoListServices.getAll,
    queryKey: ["todolists"],
    retry: false,
    select: (data) => data.data.data,
    enabled: enable,
  });
};

export const useGetTodoList = (id: string) => {
  return useQuery({
    queryFn: () => todoListServices.getById(id),
    queryKey: ["todoLists"],
  });
};

export const useUpdateTodoList = (id: string, todoList: Partial<TodoList>) => {
  return useMutation({
    mutationFn: () => todoListServices.update(id, todoList),
    onSuccess: () => {
      updateTodoList(id, todoList);
    },
  });
};

export const useCreateTodoList = () => {
  return useMutation({
    mutationFn: (todoList: Partial<TodoList>) =>
      todoListServices.create(todoList),
    onSuccess: (data) => {
      addTodoList(data.data.data);
    },
  });
};
