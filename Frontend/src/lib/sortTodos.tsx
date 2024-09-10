import { Todo, TodoList } from "@/interfaces/types";

export default function sortTodos(todos: Todo[]): Todo[] {
  return todos.sort((a, b) => {
    // First, separate completed and uncompleted todos
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // For completed todos, sort by completion time (most recent first)
    if (a.completed && b.completed) {
      return (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0);
    }

    // For uncompleted todos, sort by due date
    if (a.due_date && b.due_date) {
      const dateA =
        typeof a.due_date === "string" ? new Date(a.due_date) : a.due_date;
      const dateB =
        typeof b.due_date === "string" ? new Date(b.due_date) : b.due_date;

      return dateA.getTime() - dateB.getTime();
    }

    if (a.due_date) return -1;
    if (b.due_date) return 1;

    // If neither have due dates, sort by creation date
    return (a.created_at?.getTime() ?? 0) - (b.created_at?.getTime() ?? 0);
  });
}

export function sortTodoListsByCreatedAt(
  todoLists: TodoList[],
  order: "asc" | "desc" = "asc",
): TodoList[] {
  return [...todoLists].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    if (order === "asc") {
      return dateA - dateB; // Sort in ascending order
    } else {
      return dateB - dateA; // Sort in descending order
    }
  });
}
