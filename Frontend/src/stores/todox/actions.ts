import { Project, Todo, TodoList } from "@/interfaces/types";
import { useTodoxStore } from "./todoxStore";

export const addProject = (project: Project) => {
  useTodoxStore.setState((state) => {
    state.projects[project.id] = project;
  });
};

export const deleteProject = (projectId: string) => {
  useTodoxStore.setState((state) => {
    delete state.projects[projectId];
  });
};

export const updateProject = (project: Project) => {
  useTodoxStore.setState((state) => {
    state.projects[project.id] = project;
  });
};

export const setProjects = (projects: Project[]) => {
  useTodoxStore.setState((state) => {
    state.projects = projects.reduce(
      (acc, project) => ({
        ...acc,
        [project.id]: project,
      }),
      {},
    );
  });
};

export const addTodoList = (todoList: TodoList) => {
  useTodoxStore.setState((state) => {
    state.todoLists[todoList.id] = todoList;

    // Add todoList ID to the corresponding project
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

export const updateTodoList = (todoList: TodoList) => {
  useTodoxStore.setState((state) => {
    state.todoLists[todoList.id] = todoList;
  });
};

export const setTodoLists = (todoLists: TodoList[]) => {
  useTodoxStore.setState((state) => {
    state.todoLists = todoLists.reduce(
      (acc, todoList) => ({
        ...acc,
        [todoList.id]: todoList,
      }),
      {},
    );
  });
};

export const addTodo = (todo: Todo) => {
  useTodoxStore.setState((state) => {
    state.todos[todo.id] = todo;

    // Update the associated TodoList
    const todoList = state.todoLists[todo.todoList_id];
    if (todoList) {
      todoList.todoIds.push(todo.id);
      todoList.incompleteTodosCount += 1;
    }
  });
};

export const deleteTodo = (todoId: string) => {
  useTodoxStore.setState((state) => {
    const todo = state.todos[todoId];
    if (todo) {
      const todoList = state.todoLists[todo.todoList_id];
      if (todoList) {
        todoList.todoIds = todoList.todoIds.filter((id) => id !== todoId);
        if (todo.completed) {
          todoList.completedTodosCount -= 1;
        } else {
          todoList.incompleteTodosCount -= 1;
        }
      }
      delete state.todos[todoId];
    }
  });
};

export const updateTodo = (todo: Todo) => {
  useTodoxStore.setState((state) => {
    const oldTodo = state.todos[todo.id];
    if (oldTodo) {
      state.todos[todo.id] = todo;

      // Update the associated TodoList if completion status changed
      if (oldTodo.completed !== todo.completed) {
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

export const setTodos = (todos: Todo[]) => {
  useTodoxStore.setState((state) => {
    state.todos = todos.reduce(
      (acc, todo) => ({
        ...acc,
        [todo.id]: todo,
      }),
      {},
    );

    // Update all TodoLists with the new todos
    Object.values(state.todoLists).forEach((todoList) => {
      const todoListTodos = todos.filter(
        (todo) => todo.todoList_id === todoList.id,
      );
      todoList.todoIds = todoListTodos.map((todo) => todo.id);
      todoList.completedTodosCount = todoListTodos.filter(
        (todo) => todo.completed,
      ).length;
      todoList.incompleteTodosCount = todoListTodos.filter(
        (todo) => !todo.completed,
      ).length;
    });
  });
};
