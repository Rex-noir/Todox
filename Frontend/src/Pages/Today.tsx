import { useTodoxStore } from "@/stores/todox/todoxStore";
import { TodoItem } from "./ViewProject";
import sortTodos from "@/lib/sortTodos";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import CreateNewTodo from "@/components/custom/CreateNewTodoButton";
import { isToday } from "date-fns";

export function TodayPage() {
  const todos = useTodoxStore((state) => state.todos);

  const todayTodos = Object.values(todos).filter(
    (todo) => todo.due_date && isToday(new Date(todo.due_date)),
  );

  const sortedTodos = sortTodos(todayTodos);
  const completed = sortedTodos.filter((todo) => todo.completed);

  return (
    <div
      className="w-full max-w-lg" // Add max-w-3xl or adjust as needed
    >
      <div className="flex flex-col gap-2 px-2">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Today
        </h1>
        <p className="flex items-center gap-2 px-1 text-gray-600">
          <CheckCircledIcon /> {completed.length} of {sortedTodos.length}{" "}
          completed
        </p>
        <div>
          <CreateNewTodo />
        </div>
      </div>
      {sortedTodos.map((todo) => (
        <div key={todo.id} className="border-b">
          <TodoItem todo={todo} />
        </div>
      ))}
    </div>
  );
}
