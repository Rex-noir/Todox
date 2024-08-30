import { describe, it, expect } from "vitest";
import {
  generateUsers,
  generateProjects,
  generateTodoLists,
  generateTodos,
} from "@/lib/generator";
import { User, Project, TodoList, Todo } from "@/interfaces/types";

// Utility function to check common properties for generated items
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function expectCommonProperties(item: any, properties: string[]) {
  properties.forEach((property) => {
    expect(item).toHaveProperty(property);
  });
}

describe("Generator functions", () => {
  it("should generate a single user", () => {
    const user = generateUsers() as User;
    expectCommonProperties(user, [
      "id",
      "name",
      "email",
      "createdAt",
      "updatedAt",
      "avatar",
    ]);
  });

  it("should generate multiple users", () => {
    const users = generateUsers(3) as User[];
    expect(users).toHaveLength(3);
    users.forEach((user) => {
      expectCommonProperties(user, [
        "id",
        "name",
        "email",
        "createdAt",
        "updatedAt",
        "avatar",
      ]);
    });
  });

  it("should generate a single project", () => {
    const project = generateProjects() as Project;
    expectCommonProperties(project, [
      "id",
      "user_id",
      "title",
      "description",
      "createdAt",
      "updatedAt",
      "status",
    ]);
    expect(["active", "archived", "completed"]).toContain(project.status);
  });

  it("should generate multiple projects", () => {
    const projects = generateProjects(3) as Project[];
    expect(projects).toHaveLength(3);
    projects.forEach((project) => {
      expectCommonProperties(project, [
        "id",
        "user_id",
        "title",
        "description",
        "createdAt",
        "updatedAt",
        "status",
      ]);
      expect(["active", "archived", "completed"]).toContain(project.status);
    });
  });

  it("should generate a single todo list with valid properties", () => {
    const todoList = generateTodoLists() as TodoList;
    expectCommonProperties(todoList, [
      "id",
      "project_id",
      "title",
      "description",
      "createdAt",
      "updatedAt",
      "todoIds",
      "completedTodosCount",
      "incompleteTodosCount",
    ]);
    expect(Array.isArray(todoList.todoIds)).toBe(true);
    expect(todoList.todoIds.length).toBeGreaterThan(0);
    expect(todoList.todoIds.length).toBeLessThanOrEqual(10);
    expect(todoList.completedTodosCount + todoList.incompleteTodosCount).toBe(
      todoList.todoIds.length,
    );
  });

  it("should generate multiple todo lists with valid properties", () => {
    const todoLists = generateTodoLists(3) as TodoList[];
    expect(todoLists).toHaveLength(3);
    todoLists.forEach((todoList) => {
      expectCommonProperties(todoList, [
        "id",
        "project_id",
        "title",
        "description",
        "createdAt",
        "updatedAt",
        "todoIds",
        "completedTodosCount",
        "incompleteTodosCount",
      ]);
      expect(Array.isArray(todoList.todoIds)).toBe(true);
      expect(todoList.todoIds.length).toBeGreaterThan(0);
      expect(todoList.todoIds.length).toBeLessThanOrEqual(10);
      expect(todoList.completedTodosCount + todoList.incompleteTodosCount).toBe(
        todoList.todoIds.length,
      );
    });
  });

  it("should generate todo list with correct project_id", () => {
    const project = generateProjects() as Project;
    const todoList = generateTodoLists(1, project.id) as TodoList;
    expect(todoList.project_id).toBe(project.id);
  });

  it("should generate a single todo with valid properties", () => {
    const todo = generateTodos() as Todo;
    expectCommonProperties(todo, [
      "id",
      "title",
      "completed",
      "user_id",
      "project_id",
      "todoList_id",
      "due_date",
      "description",
      "createdAt",
      "updatedAt",
      "priority",
    ]);
    expect(typeof todo.priority).toBe("number");
  });

  it("should generate multiple todos with valid properties", () => {
    const todos = generateTodos(3) as Todo[];
    expect(todos).toHaveLength(3);
    todos.forEach((todo) => {
      expectCommonProperties(todo, [
        "id",
        "title",
        "completed",
        "user_id",
        "project_id",
        "todoList_id",
        "due_date",
        "description",
        "createdAt",
        "updatedAt",
        "priority",
      ]);
      expect(typeof todo.priority).toBe("number");
    });
  });

  it("should generate todos with a specific todoList_id", () => {
    const todoListId = "test-id";
    const todos = generateTodos(3, todoListId) as Todo[];
    expect(todos).toHaveLength(3);
    todos.forEach((todo) => {
      expect(todo.todoList_id).toBe(todoListId);
    });
  });
});
