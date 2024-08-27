import { Project, Todo, TodoList, User } from "@/interfaces/todox";
import { faker } from "@faker-js/faker";

const generateEntity = <T>(generator: () => T, count: number = 1): T | T[] =>
  count === 1 ? generator() : Array.from({ length: count }, generator);

export const generateUsers = (count: number = 1): User | User[] =>
  generateEntity(
    () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
    }),
    count,
  );

export const generateProjects = (count: number = 1): Project[] | Project =>
  generateEntity(
    () => ({
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
    }),
    count,
  );

export const generateTodoLists = (count: number = 1): TodoList[] | TodoList =>
  generateEntity(
    () => ({
      id: faker.string.uuid(),
      project_id: faker.string.uuid(),
      title: faker.lorem.words(3),
    }),
    count,
  );

export const generateTodos = (count: number = 1): Todo[] | Todo =>
  generateEntity(
    () => ({
      id: faker.string.uuid(),
      title: faker.lorem.words(3),
      completed: faker.datatype.boolean(),
      user_id: faker.string.uuid(),
      project_id: faker.string.uuid(),
      todoList_id: faker.string.uuid(),
    }),
    count,
  );
