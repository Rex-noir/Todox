import { Project, Todo, TodoList } from "@/interfaces/types";
import { generateTodos } from "@/lib/generator";
import {
  addProject,
  addTodo,
  addTodoList,
  deleteProject,
  deleteTodo,
  deleteTodoList,
  getImportantTodosList,
  getTodayTodos,
  getTodosFromList,
  setProjects,
  setTodoLists,
  setTodos,
  updateProject,
  updateTodo,
  updateTodoList,
} from "@/stores/todox/actions";
import { useTodoxStore } from "@/stores/todox/todoxStore";
import { faker } from "@faker-js/faker";
import { isToday } from "date-fns";
import { beforeEach, describe, expect, it } from "vitest";

// Sample data for testing
const sampleProject: Project = {
  id: "new-project-id",
  user_id: "1",
  title: "Test Project",
  description: "This is a test project",
  createdAt: new Date(),
  updatedAt: new Date(),
  todoListIds: [],
  status: "active",
};

const sampleTodoList: TodoList = {
  id: "new-todolist-id",
  project_id: "new-project-id",
  title: "Test TodoList",
  description: "This is a test todo list",
  createdAt: new Date(),
  updatedAt: new Date(),
  completedTodosCount: 0,
  incompleteTodosCount: 0,
  todoIds: [],
};

const sampleTodo: Todo = {
  id: "new-todo-id",
  title: "Test Todo",
  completed: false,
  user_id: "1",
  todoList_id: "new-todolist-id",
  createdAt: new Date(),
  updatedAt: new Date(),
  priority: "",
};

describe("useTodoxStore with pre-filled data", () => {
  beforeEach(() => {
    useTodoxStore.getState().reset();
  });

  describe("Project Actions", () => {
    it("can add, update, and delete a project", () => {
      const initialProjectsLength = Object.keys(
        useTodoxStore.getState().projects,
      ).length;

      addProject(sampleProject);
      let state = useTodoxStore.getState();
      expect(Object.keys(state.projects)).toHaveLength(
        initialProjectsLength + 1,
      );
      expect(state.projects[sampleProject.id]).toMatchObject(sampleProject);

      const updatedProject = { ...sampleProject, title: "Updated Project" };
      updateProject(updatedProject.id,updatedProject);
      state = useTodoxStore.getState();
      expect(state.projects[sampleProject.id]?.title).toBe("Updated Project");

      deleteProject(sampleProject.id);
      state = useTodoxStore.getState();
      expect(Object.keys(state.projects)).toHaveLength(initialProjectsLength);
      expect(state.projects[sampleProject.id]).toBeUndefined();
    });

    it("can set projects as a whole", () => {
      const newProjects = [sampleProject];
      setProjects(newProjects);
      const state = useTodoxStore.getState();
      expect(Object.keys(state.projects)).toHaveLength(1);
      expect(state.projects[sampleProject.id].title).toBe(sampleProject.title);
    });
  });

  describe("TodoList Actions", () => {
    it("can add, update, and delete a todoList", () => {
      const initialTodoListsLength = Object.keys(
        useTodoxStore.getState().todoLists,
      ).length;

      addTodoList(sampleTodoList);
      let state = useTodoxStore.getState();
      expect(Object.keys(state.todoLists)).toHaveLength(
        initialTodoListsLength + 1,
      );
      expect(state.todoLists[sampleTodoList.id]).toMatchObject(sampleTodoList);

      const updatedTodoList = { ...sampleTodoList, title: "Updated TodoList" };
      updateTodoList(updatedTodoList.id,updatedTodoList);
      state = useTodoxStore.getState();
      expect(state.todoLists[sampleTodoList.id]?.title).toBe(
        "Updated TodoList",
      );

      deleteTodoList(sampleTodoList.id);
      state = useTodoxStore.getState();
      expect(Object.keys(state.todoLists)).toHaveLength(initialTodoListsLength);
      expect(state.todoLists[sampleTodoList.id]).toBeUndefined();
    });

    it("can set todoLists as a whole", () => {
      const newTodoLists = [sampleTodoList];
      setTodoLists(newTodoLists);
      const state = useTodoxStore.getState();
      expect(Object.keys(state.todoLists)).toHaveLength(1);
      expect(state.todoLists[sampleTodoList.id].title).toBe(
        sampleTodoList.title,
      );
    });
  });

  describe("Todo Actions", () => {
    it("can add todos", () => {
      const initialTodosLength = Object.keys(
        useTodoxStore.getState().todos,
      ).length;
      addTodo(sampleTodo);
      const state = useTodoxStore.getState();
      expect(Object.keys(state.todos)).toHaveLength(initialTodosLength + 1);
    });

    it("can update a todo", () => {
      addTodo(sampleTodo);
      const toUpdate = useTodoxStore.getState().todos[sampleTodo.id];
      expect(toUpdate).toBeDefined();

      const updatedTodo = { ...toUpdate, title: "Updated Todo" };
      updateTodo(updatedTodo.id,updatedTodo);

      const state = useTodoxStore.getState();

      expect(state.todos[updatedTodo.id]).toBeDefined();
      expect(state.todos[toUpdate.id].title).toBe("Updated Todo");
    });

    it("can delete a todo", () => {
      // Ensure sampleTodo is added first
      addTodo(sampleTodo);
      const toDelete = useTodoxStore.getState().todos[sampleTodo.id];
      expect(toDelete).toBeDefined();

      deleteTodo(toDelete.id);

      const state = useTodoxStore.getState();
      expect(state.todos[toDelete.id]).toBeUndefined();
    });

    it("can set todos", () => {
      const todos = generateTodos(19) as Todo[];
      setTodos(todos);

      const state = useTodoxStore.getState();
      expect(Object.keys(state.todos).length).toBe(19);
    });
  });

  it("return empty array for empty todoIds", () => {
    addTodoList(sampleTodoList);
    const todos = getTodosFromList(sampleTodoList.id);
    expect(Array.isArray(todos)).toBe(true);
  });

  it("return todos of the todoList", () => {
    addTodoList(sampleTodoList);
    addTodo(sampleTodo);
    addTodo({ ...sampleTodo, id: "2" });
    const todos = getTodosFromList(sampleTodoList.id);
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBe(2);
  });

  it("returns correct data for today view", () => {
    const todosO = getTodayTodos();
    addTodo({ ...sampleTodo, due_date: new Date() });
    addTodo({ ...sampleTodo, id: "hi", due_date: new Date() });
    const todos = getTodayTodos();
    expect(todos).toHaveLength(todosO.length + 2);
    todos.forEach((todo) => {
      expect(todo.due_date && isToday(new Date(todo.due_date))).toBe(true);
    });
  });

  it("return correct data for important view", () => {
    addTodoList({
      ...sampleTodoList,
      id: faker.string.uuid(),
      tags: ["important"],
    });
    addTodoList({
      ...sampleTodoList,
      id: faker.string.uuid(),
      tags: ["important"],
    });

    const todoLists = getImportantTodosList();

    expect(todoLists.every((list) => list.tags?.includes("important"))).toBe(
      true,
    );
  });
});
