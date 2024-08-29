import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Todo } from "@/interfaces/types";
import { useTodoxStore } from "@/stores/todox/todoxStore";

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
    <div className="flex gap-3 overflow-hidden rounded-md bg-white p-3">
      {/* Checkbox container */}
      <div className="flex items-center gap-4">
        <Checkbox className="size-5" />
      </div>
      <div className="flex flex-col justify-center sm:flex-row sm:items-center sm:gap-3">
        <p className="min-w-0 flex-1 truncate">{todo.title}</p>
        <div className="flex gap-2">
          {todo.tags.map((tag) => (
            <Badge variant={"outline"} className="h-4 text-blue-500" key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
