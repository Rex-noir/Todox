import { Project, Todo, TodoList } from "@/interfaces/types";
import { useTodoxStore } from "./todoxStore";
import { isToday } from "date-fns";

export const addProject = (project: Project) => {
  useTodoxStore.setState((state) => {
    state.projects[project.id] = project;
  });
};

export const deleteProject = (projectId: string) => {
  useTodoxStore.setState((state) => {
    // Find the project to be deleted
    const project = state.projects[projectId];
    if (!project) return; // If the project doesn't exist, exit early

    // Get the TodoList IDs associated with the project
    const todoListIds = project.todoListIds;

    // Delete all Todos that belong to the TodoLists of this project
    todoListIds.forEach((todoListId) => {
      const todoList = state.todoLists[todoListId];
      if (todoList) {
        // Delete all todos associated with the todoList
        todoList.todoIds.forEach((todoId) => {
          delete state.todos[todoId];
        });

        // Delete the todoList itself
        delete state.todoLists[todoListId];
      }
    });

    // Finally, delete the project itself
    delete state.projects[projectId];
  });
};

export const updateProject = (id: string, project: Partial<Project>) => {
  useTodoxStore.setState((state) => {
    // Ensure the project exists before updating
    if (state.projects[id]) {
      // Merge existing project data with the new partial data
      state.projects[id] = { ...state.projects[id], ...project };
    }
  });
};

export const setProjects = (projects: Project[] = []) => {
  useTodoxStore.setState((state) => {
    if (Array.isArray(projects) && projects.length === 0) {
      state.projects = {};
    } else {
      state.projects = projects.reduce(
        (acc, project) => ({
          ...acc,
          [project.id]: {
            ...project,
            created_at: project.created_at
              ? new Date(project.created_at)
              : undefined,
            updated_at: project.updated_at
              ? new Date(project.updated_at)
              : undefined,
          },
        }),
        {},
      );
    }
  });
};

export const addTodoList = (todoList: TodoList) => {
  useTodoxStore.setState((state) => {
    state.todoLists[todoList.id] = todoList;

    const project = state.projects[todoList.project_id];
    if (project) {
      project.todoListIds.push(todoList.id);
    }
  });
};

export const deleteTodoList = (todoListId: string) => {
  useTodoxStore.setState((state) => {
    const todoList = state.todoLists[todoListId];
    if (todoList) {
      // Remove associated todos
      todoList.todoIds.forEach((todoId) => {
        delete state.todos[todoId];
      });

      // Remove todoList from project
      const project = state.projects[todoList.project_id];
      if (project) {
        project.todoListIds = project.todoListIds.filter(
          (id) => id !== todoListId,
        );
      }

      delete state.todoLists[todoListId];
    }
  });
};

export const updateTodoList = (id: string, todoList: Partial<TodoList>) => {
  // Get the current state of the todo list
  const oldTodoList = useTodoxStore.getState().todoLists[id];

  useTodoxStore.setState((state) => {
    if (state.todoLists[id]) {
      state.todoLists[id] = {
        ...oldTodoList, // Spread the existing properties
        ...todoList, // Override with any new properties from the updated todoList
      };
    }
  });
};

export const setTodoLists = (todoLists: TodoList[] = []) => {
  useTodoxStore.setState((state) => {
    state.todoLists = todoLists.reduce(
      (acc, todoList) => ({
        ...acc,
        [todoList.id]: {
          ...todoList,
          created_at: new Date(todoList.created_at),
          updated_at: new Date(todoList.updated_at),
        },
      }),
      {},
    );
  });
};

export const addTodo = (todo: Todo) => {
  useTodoxStore.setState((state) => {
    state.todos[todo.id] = {
      ...todo,
      due_date: todo.due_date ? new Date(todo.due_date) : undefined,
    };

    if (todo.todoList_id) {
      const todoList = state.todoLists[todo.todoList_id];
      if (todoList) {
        todoList.todoIds.push(todo.id);
        todoList.incompleteTodosCount += 1;
      }
    }
  });
};

export const deleteTodo = (todoId: string) => {
  useTodoxStore.setState((state) => {
    const todo = state.todos[todoId];
    if (todo.todoList_id) {
      const todoList = state.todoLists[todo.todoList_id];
      if (todoList) {
        todoList.todoIds = todoList.todoIds.filter((id) => id !== todoId);
        if (todo.completed) {
          todoList.completedTodosCount -= 1;
        } else {
          todoList.incompleteTodosCount -= 1;
        }
      }
    }
    delete state.todos[todoId];
  });
};

export const updateTodo = (id: string, todo: Partial<Todo>) => {
  useTodoxStore.setState((state) => {
    const oldTodo = state.todos[id];
    if (oldTodo) {
      state.todos[id] = { ...oldTodo, ...todo };

      // Ensure todo.todoList_id exists and is a valid type
      if (
        oldTodo.completed !== todo.completed &&
        todo.todoList_id !== undefined
      ) {
        const todoList = state.todoLists[todo.todoList_id];
        if (todoList) {
          if (todo.completed) {
            todoList.completedTodosCount += 1;
            todoList.incompleteTodosCount -= 1;
          } else {
            todoList.completedTodosCount -= 1;
            todoList.incompleteTodosCount += 1;
          }
        }
      }
    }
  });
};

export const setTodos = (todos: Todo[] = []) => {
  useTodoxStore.setState((state) => {
    state.todos = todos.reduce(
      (acc, todo) => ({
        ...acc,
        [todo.id]: {
          ...todo,
          created_at: todo.created_at ? new Date(todo.created_at) : undefined,
          updated_at: todo.updated_at ? new Date(todo.updated_at) : undefined,
          completedAt: todo.completedAt
            ? new Date(todo.completedAt)
            : undefined,
          due_date: todo.due_date ? new Date(todo.due_date) : undefined,
        },
      }),
      {},
    );
    return state;
  });
};

export const getTodosFromList = (todoListId: string) => {
  const todoList = useTodoxStore.getState().todoLists[todoListId];
  return todoList.todoIds.map((id) => useTodoxStore.getState().todos[id]) || [];
};

export const getAllProjects = () => {
  return Object.values(useTodoxStore.getState().projects);
};

export const getListFromProject = (projectId: string | undefined) => {
  if (!projectId) return [];
  const project = useTodoxStore.getState().projects[projectId];
  if (!project) return [];
  return project.todoListIds.map(
    (id) => useTodoxStore.getState().todoLists[id],
  );
};

export const getTodoList = (id: string | null) => {
  if (!id) return [];
  const todoList = useTodoxStore.getState().todoLists[id];
  return todoList;
};

export const getAllTodoLists = () => {
  return Object.values(useTodoxStore.getState().todoLists);
};

export const getImportantTodosList = () => {
  return Object.values(useTodoxStore.getState().todoLists).filter((list) =>
    list.tags?.includes("important"),
  );
};

export const getTodosForProject = (projectId: string | undefined) => {
  if (!projectId) return [];
  const project = useTodoxStore.getState().projects[projectId];
  if (!project) return [];
  return project.todoListIds
    .map((id) => useTodoxStore.getState().todoLists[id])
    .flatMap((list) =>
      list.todoIds.map((id) => useTodoxStore.getState().todos[id]),
    );
};

export const getTodayTodos = () => {
  return Object.values(useTodoxStore.getState().todos).filter(
    (todo) => todo.due_date && isToday(new Date(todo.due_date)),
  );
};

export const getProject = (projectId?: string) => {
  return Object.values(useTodoxStore.getState().projects).find(
    (project) => project.id === projectId,
  );
};
