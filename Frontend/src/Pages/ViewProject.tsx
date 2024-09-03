import CreateNewTodo from "@/components/custom/CreateNewTodoButton";
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
import { updateTodo } from "@/stores/todox/actions";
import {
  selectListFromProject,
  selectTodosFromList,
  useTodoxStore,
} from "@/stores/todox/todoxStore";
import { format } from "date-fns";
import { LuCalendar } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { CreateNewTodoList } from "@/components/custom/CreateNewTodolistButton";
import sortTodos, { sortTodoListsByCreatedAt } from "@/lib/sortTodos";
import DeleteTodoButton from "@/components/custom/DeleteTodoButton";
import { useMemo, useState } from "react";
import TodoListDialog from "@/components/custom/TodoListDialog";

export function ViewProject() {
  const { projectId } = useParams();

  const todoLists = useTodoxStore(selectListFromProject)(projectId ?? "");

  const isEmpty = todoLists.length === 0;

  const getTitle = () => {
    if (projectId) {
      const project = useTodoxStore.getState().projects[projectId];
      return project ? project.title : "Unknown Project";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={projectId}
      className="w-full max-w-xl" // Add max-w-3xl or adjust as needed
    >
      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="italic text-gray-500"
        >
          Wow so empty.
          <CreateNewTodoList />
        </motion.div>
      ) : (
        <motion.div layout className="mx-auto h-full w-full space-y-2">
          <AnimatePresence>
            <div className="flex w-full flex-col gap-1 border-b pb-2">
              <h1
                className={`px-2 text-xl font-semibold transition-opacity duration-300 ease-in-out`}
              >
                {getTitle()}
              </h1>
              <CreateNewTodoList />
            </div>
            {sortTodoListsByCreatedAt(todoLists, "desc").map((list, index) => (
              <motion.div
                key={list.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Accordion
                  type="multiple"
                  defaultValue={todoLists.map((list) => list.id)}
                  className="w-full px-2"
                >
                  <AccordionItem value={list.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <TodoListItem list={list} />
                    </AccordionTrigger>
                    <AccordionContent>
                      <motion.div layout className="ml-5 space-y-2">
                        <CreateNewTodo listIdParam={list.id} />
                        <AnimatePresence>
                          <TodoLists listId={list.id} />
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

function TodoLists({ listId }: { listId: string }) {
  const todos = useTodoxStore(selectTodosFromList)(listId);
  const sortedTodos = useMemo(() => sortTodos(todos), [todos]);
  return (
    <>
      {sortedTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </>
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
              updateTodo(todo.id, {
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
                {todo.due_date ? format(todo.due_date, "PP") : "Not set"}
              </span>
              <DeleteTodoButton todoId={todo.id} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function TodoListItem({ list }: { list: TodoList }) {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setOpenDialog(true);
      }}
      className="flex w-full cursor-pointer gap-3 overflow-hidden rounded-md p-3 text-left transition-colors duration-200"
    >
      <TodoListDialog
        id={list.id}
        key={list.id}
        open={openDialog}
        onOpenChange={() => setOpenDialog(!openDialog)}
      />
      <div className="grid w-full items-center gap-1 sm:gap-3">
        <div className="w-fit max-w-full overflow-hidden">
          <p className="min-w-0 flex-1 truncate font-bold text-gray-900">
            {list.title}
          </p>
          <p className="text-sm text-gray-600">{list.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(list.tags) &&
            list.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
        </div>
      </div>
    </div>
  );
}
