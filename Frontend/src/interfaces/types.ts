export interface User {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
}

export interface Project {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: ProjectStatus;
  todoListIds: string[];
  iconColor?: string; // New field for icon color
}

export type ProjectStatus =
  | "active"
  | "archived"
  | "completed"
  | "in progress"
  | "on hold"
  | null;

export interface TodoList {
  readonly id: string;
  project_id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  completedTodosCount: number;
  incompleteTodosCount: number;
  todoIds: string[];
  tags?: Array<"important" | "urgent" | "high-priority" | string>; // array of specified or custom tags
}

export interface Todo {
  readonly id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
  user_id?: string;
  project_id: string;
  todoList_id: string;
  due_date?: Date;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  priority: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
