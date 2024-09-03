import { Project, Todo, TodoList } from "@/interfaces/types";
import createSelectors from "@/lib/selector";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import initialdataMock from "./initialdata.mock";

export type NormalizedData<T> = { [id: string]: T };

type State = {
  projects: NormalizedData<Project>;
  todoLists: NormalizedData<TodoList>;
  todos: NormalizedData<Todo>;
};

type Action = {
  reset: () => void;
};

const initialState: State = initialdataMock();

const useTodoxStoreBase = create<State & Action>()(
  immer((set) => ({
    ...initialState,
    reset: () => {
      set(() => initialState);
    },
  })),
);

export const useTodoxStore = createSelectors(useTodoxStoreBase);

export const selectTodosFromList = (state: State) => (todoListId: string) =>
  state.todoLists[todoListId]?.todoIds.map((id) => state.todos[id]) || [];

export const selectListFromProject = (state: State) => (projectId: string) =>
  state.projects[projectId]?.todoListIds.map((id) => state.todoLists[id]) || [];

export const selectTodosForProject = (state: State) => (projectId: string) =>
  state.projects[projectId]?.todoListIds
    .flatMap((listId) => state.todoLists[listId]?.todoIds || [])
    .map((todoId) => state.todos[todoId])
    .filter(Boolean) || [];

export const selectListFromStore = (state: State) => (listId: string) =>
  Object.values(state.todoLists).find((list) => list.id === listId);
