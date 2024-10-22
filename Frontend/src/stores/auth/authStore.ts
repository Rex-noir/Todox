import { User } from "@/interfaces/types";
import createSelectors from "@/lib/selector";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  user: User | null;
  isAuthenticated: boolean;
};

type Action = {
  login: (user: User) => void;
  logout: () => void;
  update: (user: Partial<User>) => void;
};

const initialState: State = {
  user: null,
  isAuthenticated: false,
};

const useAuthStoreBase = create<State & Action>()(
  immer((set) => ({
    ...initialState,
    login: (user) =>
      set((state) => {
        state.user = user;
        state.isAuthenticated = true;
      }),
    logout: () =>
      set((state) => {
        state.user = null;
        state.isAuthenticated = false;
      }),
    update: (user) => {
      set((state) => {
        if (state.user) {
          state.user = { ...state.user, ...user };
      }
      });
    },
  })),
);

export const useAuthStore = createSelectors(useAuthStoreBase);
