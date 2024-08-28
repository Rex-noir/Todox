import { Project, Todo, TodoList } from "@/interfaces/types";
import { generateTodos } from "@/lib/generator";
import {
  addProject,
  addTodo,
  addTodoList,
  deleteProject,
  deleteTodo,
  deleteTodoList,
  setProjects,
  setTodoLists,
  setTodos,
  updateProject,
  updateTodo,
  updateTodoList,
} from "@/stores/todox/actions";
import { useTodoxStore } from "@/stores/todox/todoxStore";
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
  project_id: "new-project-id",
  todoList_id: "new-todolist-id",
  createdAt: new Date(),
  updatedAt: new Date(),
  priority: 1,
  tags: ["test"],
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
      updateProject(updatedProject);
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
      updateTodoList(updatedTodoList);
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
      updateTodo(updatedTodo);

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
});
