import api from "@/api";
import { TodoList } from "@/interfaces/types";
import {
  addTodoList,
  deleteTodoList,
  updateTodoList,
} from "@/stores/todox/actions";
import { useMutation, useQuery } from "@tanstack/react-query";

export const todoListServices = {
  delete: (id: string) => api.delete(`/todolists/${id}`),
  getAll: (): Promise<TodoList[]> => api.get("/todolists"),
  getById: (id: string): Promise<TodoList> => api.get(`/todolists/${id}`),
  update: (id: string, todoList: Partial<TodoList>) =>
    api.put(`/todolists/${id}`, todoList),
  create: (todoList: Partial<TodoList>): Promise<TodoList> =>
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

export const useGetAllTodoList = () => {
  return useQuery({
    queryFn: todoListServices.getAll,
    queryKey: ["todolists"],
    retry: false,
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

export const useCreateTodoList = (todoList: Partial<TodoList>) => {
  return useMutation({
    mutationFn: () => todoListServices.create(todoList),
    onSuccess: (data) => {
      addTodoList(data);
    },
  });
};
