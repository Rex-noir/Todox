import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Todo } from "@/interfaces/types";
import { useTodoxStore } from "@/stores/todox/todoxStore";
import { LuCalendar } from "react-icons/lu";

export function ViewTodoList() {
  const todos = useTodoxStore().todos;

  const isEmpty = Object.keys(todos).length === 0;

  return (
    <div className="flex h-[90%] max-w-full flex-col gap-2 px-3">
      {isEmpty ? (
        <p>Empty.</p>
      ) : (
        Object.entries(todos).map(([key, todo]) => (
          <TodoItem key={key} todo={todo} />
        ))
      )}
    </div>
  );
}

export function TodoItem({ todo }: { todo: Todo }) {
  return (
    <div className="flex cursor-pointer gap-3 overflow-hidden rounded-md bg-white p-3 hover:bg-neutral-100">
      <div className="flex items-start gap-4">
        <Checkbox className="mt-2 size-5" />
      </div>
      <div className="grid w-full items-center gap-1 sm:gap-3 md:grid-cols-3">
        <div className="w-fit max-w-full overflow-hidden">
          <p className="min-w-0 flex-1 truncate">{todo.title}</p>
          <p className="truncate text-sm font-thin">{todo.description}</p>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant={"outline"} className="h-5">
            {todo.tag}
          </Badge>
        </div>
        <div className="flex items-center gap-1 md:justify-end">
          <LuCalendar />
          <span>{todo.due_date?.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
