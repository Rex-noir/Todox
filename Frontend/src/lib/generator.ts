import { Project, Todo, TodoList, User } from "@/interfaces/types";
import { faker } from "@faker-js/faker";

const generateEntity = <T>(generator: () => T, count: number = 1): T | T[] =>
  count === 1 ? generator() : Array.from({ length: count }, generator);

export const generateUsers = (count: number = 1): User | User[] =>
  generateEntity(
    (): User => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      avatar: faker.image.avatar(),
    }),
    count,
  );

export const generateProjects = (
  count: number = 1,
  todoList_id?: string[],
): Project | Project[] =>
  generateEntity(
    (): Project => ({
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      status: faker.helpers.arrayElement(["active", "archived", "completed"]),
      todoListIds: todoList_id || [],
    }),
    count,
  );

export const generateTodoLists = (
  count: number = 1,
  project_id?: string,
): TodoList | TodoList[] => {
  const generator = (): TodoList => {
    const todoList: TodoList = {
      id: faker.string.uuid(),
      project_id: project_id || faker.string.uuid(),
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      completedTodosCount: 0,
      incompleteTodosCount: 0,
      todoIds: [],
    };
    const todos = generateTodos(
      faker.number.int({ min: 2, max: 10 }),
      todoList.id,
    ) as Todo[];
    todoList.todoIds = todos.map((todo) => todo.id);
    todoList.completedTodosCount = todos.filter(
      (todo) => todo.completed,
    ).length;
    todoList.incompleteTodosCount = todos.filter(
      (todo) => !todo.completed,
    ).length;
    return todoList;
  };

  return count === 1 ? generator() : Array.from({ length: count }, generator);
};

export const generateTodos = (
  count: number = 1,
  todoList_id?: string,
): Todo | Todo[] =>
  generateEntity(
    (): Todo => ({
      id: faker.string.uuid(),
      title: faker.lorem.words(3),
      completed: faker.datatype.boolean(),
      user_id: faker.string.uuid(),
      project_id: faker.string.uuid(),
      todoList_id: todoList_id || faker.string.uuid(),
      due_date: faker.date.future(),
      description: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      priority: faker.number.int({ min: 3, max: 20 }),
      tags: faker.helpers.arrayElements(
        ["work", "personal", "urgent", "important"],
        { min: 0, max: 3 },
      ),
    }),
    count,
  );