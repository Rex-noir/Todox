import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoItem } from "./ViewTodoList";
import { useTodoxStore } from "@/stores/todox/todoxStore";
import { TodoListItem } from "./ViewProject";

export default function ViewAll() {
  return (
    <div className="h-full w-full rounded-xl">
      <Tabs defaultValue="todoList" className="mb-12 w-full">
        <TabsList className="flex w-fit justify-center sm:w-fit">
          <TabsTrigger value="todoList">Todo List</TabsTrigger>
          <TabsTrigger value="todo">Todo</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent className="h-full" value="todo">
          <TodoContents />
        </TabsContent>
        <TabsContent value="todoList">
          <TodoListContents />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TodoContents() {
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

function TodoListContents() {
  const lists = useTodoxStore().todoLists;

  const isEmpty = Object.keys(lists).length === 0;
  return (
    <div className="flex h-[90%] max-w-full flex-col gap-2 px-3">
      {isEmpty ? (
        <p>Empty</p>
      ) : (
        Object.entries(lists).map(([key, list]) => (
          <TodoListItem key={key} list={list} />
        ))
      )}
    </div>
  );
}
