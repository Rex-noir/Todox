import { Project, Todo, TodoList } from "@/interfaces/types";
import createSelectors from "@/lib/selector";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type NormalizedData<T> = { [id: string]: T };

type State = {
  projects: NormalizedData<Project>;
  todoLists: NormalizedData<TodoList>;
  todos: NormalizedData<Todo>;
};

type Action = {
  reset: () => void;
};

const initialState: State = {
  projects: {},
  todoLists: {},
  todos: {},
};

const useTodoxStoreBase = create<State & Action>()(
  immer((set) => ({
    ...initialState,
    reset: () => {
      set(() => initialState);
    },
  })),
);

export const useTodoxStore = createSelectors(useTodoxStoreBase);
