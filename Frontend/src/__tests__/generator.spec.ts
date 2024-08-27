import { describe, it, expect } from "vitest";
import {
  generateUsers,
  generateProjects,
  generateTodoLists,
  generateTodos,
} from "@/lib/generator";
import { User, Project, TodoList, Todo } from "@/interfaces/todox";

describe("Generator functions", () => {
  it("should generate a single user", () => {
    const user = generateUsers() as User;
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
  });

  it("should generate multiple users", () => {
    const users = generateUsers(3) as User[];
    expect(users).toHaveLength(3);
    users.forEach((user) => {
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("email");
    });
  });

  it("should generate a single project", () => {
    const project = generateProjects() as Project;
    expect(project).toHaveProperty("id");
    expect(project).toHaveProperty("user_id");
    expect(project).toHaveProperty("title");
    expect(project).toHaveProperty("description");
  });

  it("should generate multiple projects", () => {
    const projects = generateProjects(3) as Project[];
    expect(projects).toHaveLength(3);
    projects.forEach((project) => {
      expect(project).toHaveProperty("id");
      expect(project).toHaveProperty("user_id");
      expect(project).toHaveProperty("title");
      expect(project).toHaveProperty("description");
    });
  });

  it("should generate a single todo list", () => {
    const todoList = generateTodoLists() as TodoList;
    expect(todoList).toHaveProperty("id");
    expect(todoList).toHaveProperty("project_id");
    expect(todoList).toHaveProperty("title");
  });

  it("should generate multiple todo lists", () => {
    const todoLists = generateTodoLists(3) as TodoList[];
    expect(todoLists).toHaveLength(3);
    todoLists.forEach((todoList) => {
      expect(todoList).toHaveProperty("id");
      expect(todoList).toHaveProperty("project_id");
      expect(todoList).toHaveProperty("title");
    });
  });

  it("should generate a single todo", () => {
    const todo = generateTodos() as Todo;
    expect(todo).toHaveProperty("id");
    expect(todo).toHaveProperty("title");
    expect(todo).toHaveProperty("completed");
    expect(todo).toHaveProperty("user_id");
    expect(todo).toHaveProperty("project_id");
    expect(todo).toHaveProperty("todoList_id");
  });

  it("should generate multiple todos", () => {
    const todos = generateTodos(3) as Todo[];
    expect(todos).toHaveLength(3);
    todos.forEach((todo) => {
      expect(todo).toHaveProperty("id");
      expect(todo).toHaveProperty("title");
      expect(todo).toHaveProperty("completed");
      expect(todo).toHaveProperty("user_id");
      expect(todo).toHaveProperty("project_id");
      expect(todo).toHaveProperty("todoList_id");
    });
  });
});
