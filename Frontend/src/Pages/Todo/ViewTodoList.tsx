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
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  getAllTodoLists,
  getListsFromCurrentProject,
  getTodosFromList,
  updateTodo,
} from "@/stores/todox/actions";
import { useTodoxStore } from "@/stores/todox/todoxStore";
import { format } from "date-fns";
import { LuCalendar } from "react-icons/lu";

const sortTodos = (todos: Todo[]) => {
  return todos.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    if (a.completed && b.completed) {
      return (
        new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
      );
    }

    const priorityA = parseInt(a.priority, 10);
    const priorityB = parseInt(b.priority, 10);
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime();
  });
};

export function ViewTodoList() {
  const currentViewProject = useTodoxStore((state) => state.currentViewProject);
  const todos = useTodoxStore((state) => state.todos);

  const listsToRender = currentViewProject
    ? getListsFromCurrentProject()
    : getAllTodoLists();

  const isEmpty = Object.keys(todos).length === 0 || listsToRender.length === 0;

  const allListId = Object.keys(useTodoxStore().todoLists).map((id) => id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={currentViewProject} // Add a key to force re-render on project change
      className="h-full w-full rounded-xl px-2"
    >
      {isEmpty ? (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="italic text-gray-500"
        >
          No todos available for the current project.
          <CreateNewTodoList />
        </motion.p>
      ) : (
        <motion.div layout className="h-full space-y-2">
          <AnimatePresence>
            {listsToRender.map((list, index) => (
              <motion.div
                key={list.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Accordion
                  type="multiple"
                  defaultValue={allListId}
                  className="w-full px-2"
                >
                  <AccordionItem value={list.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <TodoListItem list={list} />
                    </AccordionTrigger>
                    <AccordionContent>
                      <motion.div layout className="ml-5 space-y-2">
                        <CreateNewTodo listId={list.id} />
                        <AnimatePresence>
                          {sortTodos(getTodosFromList(list.id)).map((todo) => (
                            <TodoItem key={todo.id} todo={todo} />
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}

const todoVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function TodoItem({ todo }: { todo: Todo }) {
  return (
    <AnimatePresence>
      <motion.div
        key={todo.id}
        variants={todoVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          mass: 1,
        }}
        className={cn(
          "flex cursor-pointer gap-3 overflow-hidden rounded-md border-gray-200 p-3 transition-colors duration-200",
        )}
      >
        <div className="flex items-start gap-4">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={(value) =>
              updateTodo({
                ...todo,
                completed: !!value,
                completedAt: value ? new Date() : undefined,
              })
            }
            className="mt-2 size-5 rounded-full"
          />
        </div>
        <div className="grid w-full items-center gap-1 sm:gap-3">
          <div className="w-fit max-w-full overflow-hidden">
            <motion.p
              layout
              className={`min-w-0 flex-1 truncate font-medium ${
                todo.completed ? "text-gray-500 line-through" : "text-gray-800"
              }`}
            >
              {todo.title}
            </motion.p>
            <motion.p
              layout
              className={`text-sm ${
                todo.completed ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {todo.description}
            </motion.p>
            <motion.div
              layout
              className="mt-1 flex items-center gap-1 text-sm text-gray-500"
            >
              <LuCalendar className="text-gray-400" />
              <span>
                {todo.due_date ? format(todo.due_date, "PPP") : "Not set"}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
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
