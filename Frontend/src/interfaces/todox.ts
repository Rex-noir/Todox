export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
}

export interface TodoList {
  id: string;
  project_id: string;
  title: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  project_id: string;
  todoList_id: string;
  due_date?: string;
  description?: string;
}
