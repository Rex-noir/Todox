import { Todo } from "@/interfaces/types";

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
      return a.due_date.getTime() - b.due_date.getTime();
    }
    if (a.due_date) return -1;
    if (b.due_date) return 1;

    // If neither have due dates, sort by creation date
    return (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0);
  });
}
