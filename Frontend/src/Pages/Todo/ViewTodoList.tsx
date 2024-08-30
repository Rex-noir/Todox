import CreateNewTodo from "@/components/custom/CreateNewTodoButton";
import { CreateNewTodoList } from "@/components/custom/CreateNewTodolistButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Todo, TodoList } from "@/interfaces/types";
import {
  getAllTodoLists,
  getListsFromCurrentProject,
  getTodosFromList,
} from "@/stores/todox/actions";
import { useTodoxStore } from "@/stores/todox/todoxStore";
import { LuCalendar } from "react-icons/lu";

export function ViewTodoList() {
  const currentViewProject = useTodoxStore((state) => state.currentViewProject);
  const todos = useTodoxStore((state) => state.todos);

  const listsToRender = currentViewProject
    ? getListsFromCurrentProject()
    : getAllTodoLists();

  const isEmpty = Object.keys(todos).length === 0 || listsToRender.length === 0;

  const allListId = Object.keys(useTodoxStore().todoLists).map((id) => id);
  const currentProject = currentViewProject
    ? useTodoxStore.getState().projects[currentViewProject]
    : null;

  return (
    <div className="h-full w-full rounded-xl px-2">
      {isEmpty ? (
        <p className="italic text-gray-500">
          No todos available for the current project.
          <CreateNewTodoList />
        </p>
      ) : (
        <div className="space-y-2">
          <div>
            <h1 className="text-2xl font-semibold">
              {currentProject ? currentProject.title : "All"}
            </h1>
          </div>
          {listsToRender.map((list, index) => (
            <Accordion
              type="multiple"
              defaultValue={allListId}
              key={index}
              className="w-full px-2"
            >
              <AccordionItem value={list.id}>
                <AccordionTrigger className="hover:no-underline">
                  <TodoListItem list={list} />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="ml-5 space-y-2">
                    <CreateNewTodo listId={list.id} />
                    {getTodosFromList(list.id).map((todo) => (
                      <div key={todo.id} className="border-b">
                        <TodoItem todo={todo} />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  );
}

export function TodoItem({ todo }: { todo: Todo }) {
  return (
    <div className="flex cursor-pointer gap-3 overflow-hidden rounded-md border-gray-200 p-3 transition-colors duration-200">
      <div className="flex items-start gap-4">
        <Checkbox className="mt-2 size-5 rounded-full" />
      </div>
      <div className="grid w-full items-center gap-1 sm:gap-3">
        <div className="w-fit max-w-full overflow-hidden">
          <p className="min-w-0 flex-1 truncate font-medium text-gray-800">
            {todo.title}
          </p>
          <p className="text-sm text-gray-600">{todo.description}</p>
          <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <LuCalendar className="text-gray-400" />
            <span>{todo.due_date?.toLocaleDateString() || "Not set"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TodoListItem({ list }: { list: TodoList }) {
  return (
    <div className="flex cursor-pointer gap-3 overflow-hidden rounded-md p-3 text-left transition-colors duration-200">
      <div className="grid w-full items-center gap-1 sm:gap-3">
        <div className="w-fit max-w-full overflow-hidden">
          <p className="min-w-0 flex-1 truncate font-bold text-gray-900">
            {list.title}
          </p>
          <p className="text-sm text-gray-600">{list.description}</p>
        </div>
      </div>
    </div>
  );
}
