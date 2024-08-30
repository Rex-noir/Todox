import { Project, Todo, TodoList } from "@/interfaces/types";
import { NormalizedData } from "./todoxStore";
import {
  generateProjects,
  generateTodoLists,
  generateTodos,
} from "@/lib/generator";

export default () => {
  const projects: NormalizedData<Project> = {};
  const todoLists: NormalizedData<TodoList> = {};
  const todos: NormalizedData<Todo> = {};

  // Generate projects and normalize
  (generateProjects(3) as Project[]).forEach((project) => {
    projects[project.id] = project as Project;
    const generatedTodoLists = generateTodoLists(2, project.id) as TodoList[];

    // Associate todoLists with the project
    project.todoListIds = generatedTodoLists.map((todoList) => todoList.id);

    // Normalize and store todoLists
    generatedTodoLists.forEach((todoList) => {
      todoLists[todoList.id] = todoList;
      const generatedTodos = generateTodos(3, todoList.id) as Todo[];

      // Associate todos with the todoList
      todoList.todoIds = generatedTodos.map((todo) => todo.id);
      todoList.completedTodosCount = generatedTodos.filter(
        (todo) => todo.completed,
      ).length;
      todoList.incompleteTodosCount = generatedTodos.filter(
        (todo) => !todo.completed,
      ).length;

      // Normalize and store todos
      generatedTodos.forEach((todo) => {
        todos[todo.id] = todo;
      });
    });
  });

  return {
    projects,
    todoLists,
    todos,
    currentViewProject: null,
  };
};
