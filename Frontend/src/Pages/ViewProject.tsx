import CreateNewTodo from "@/components/custom/CreateNewTodoButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ProjectStatus, Todo } from "@/interfaces/types";
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
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { CreateNewTodoList } from "@/components/custom/CreateNewTodolistButton";
import sortTodos, { sortTodoListsByCreatedAt } from "@/lib/sortTodos";
import DeleteTodoButton from "@/components/custom/DeleteTodoButton";
import { useEffect, useMemo, useState } from "react";
import ProjectOptions from "@/components/custom/ProjectOptions";
import { Input } from "@/components/ui/input";
import { AutosizeTextarea } from "@/components/ui/auto-text-area";
import { Button } from "@/components/ui/button";
import { useUpdateProject } from "@/services/projectService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TbLoader3 } from "react-icons/tb";
import { TodoListItem } from "@/components/custom/TodoListItem";
import { useUpdateTodo } from "@/services/todoService";
import { formatToMySQLDateTime } from "@/utils/dateFormatter";

export function ViewProject() {
  const { projectId } = useParams();
  const project = useTodoxStore().projects[projectId ?? ""];

  const navigate = useNavigate();

  useEffect(() => {
    if (!project) {
      navigate("/app/today");
    }
  }, [project, navigate]);

  const [editingProject, setEditingProject] = useState(false);

  const [projectTitle, setProjectTitle] = useState(project?.title);
  const [projectDescription, setProjectDescription] = useState(
    project?.description,
  );
  const [status, setStatus] = useState<ProjectStatus>(null);

  const updateMutation = useUpdateProject(project?.id, {
    description: projectDescription,
    title: projectTitle,
    status: status,
  });

  const todoLists = useTodoxStore(selectListFromProject)(projectId ?? "");

  useEffect(() => {
    if (updateMutation.isSuccess) {
      setEditingProject(false);
    }
  }, [updateMutation.isSuccess]);

  if (!project) {
    return null;
  }

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setProjectTitle(project.title);
    setProjectDescription(project.description);
    setStatus(project.status ?? null);
    setEditingProject(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={projectId}
      className="w-full max-w-xl" // Add max-w-3xl or adjust as needed
    >
      <motion.div layout className="mx-auto h-full w-full space-y-2">
        <AnimatePresence>
          <div className="flex w-full cursor-text flex-col gap-1 border-b pb-2">
            <div className="px-2">
              {editingProject ? (
                <div>
                  <Input
                    placeholder="Title"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="border-none text-xl focus-visible:ring-0"
                    required
                  />
                  <AutosizeTextarea
                    value={projectDescription ?? ""}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    required
                    placeholder="Description"
                    className="!min-h-0 resize-none border-0 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Select
                    value={status || undefined}
                    onValueChange={(value) => setStatus(value as ProjectStatus)}
                  >
                    <SelectTrigger
                      aria-label="status"
                      id="status"
                      className="mx-3 mb-3 mt-3 w-fit"
                    >
                      <SelectValue placeholder="Select project status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="on hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={handleCancel}
                      size={"sm"}
                      variant={"outline"}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => updateMutation.mutate()}
                      size={"sm"}
                      variant={"destructive"}
                    >
                      {updateMutation.isPending ? (
                        <>
                          <TbLoader3 className="animate-spin" />
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setEditingProject(true)}
                  className="flex flex-col gap-2"
                >
                  <div className="flex w-full justify-between">
                    <div className="w-full">
                      <h1
                        className={`w-full text-xl font-semibold transition-opacity duration-300 ease-in-out`}
                      >
                        Project : {projectTitle}
                      </h1>
                    </div>
                    <ProjectOptions projectId={project.id} />
                  </div>
                  <p className="text-sm">{projectDescription}</p>
                  {project.status && (
                    <Badge className="w-fit">{project.status}</Badge>
                  )}
                </div>
              )}
            </div>
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
    </motion.div>
  );
}

function TodoLists({ listId }: { listId: string }) {
  const todos = selectTodosFromList(useTodoxStore())(listId);

  const sortedTodos = useMemo(() => sortTodos(todos), [todos]);

  if (todos.length === 0) {
    return <div>No todos in this list</div>;
  }

  return (
    <>
      {sortedTodos.map(
        (todo) => todo && <TodoItem key={todo.id} todo={todo} />,
      )}
    </>
  );
}

const todoVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function TodoItem({ todo }: { todo: Todo }) {
  const updateMutation = useUpdateTodo(todo.id);

  const updateCompleted = (value: boolean) => {
    const update: Partial<Todo> = {
      ...todo,
      completed: !!value,
      completedAt: value ? new Date() : undefined,
      due_date: formatToMySQLDateTime(todo.due_date ?? new Date()),
    };

    updateTodo(todo.id, update);

    updateMutation.mutate(update);
  };

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
            onCheckedChange={updateCompleted}
            className="mt-2 size-5 rounded-full"
          />
        </div>
        <div className="grid w-full items-center gap-1 sm:gap-3">
          <div className="w-fit max-w-full overflow-hidden">
            <motion.p
              layout
              className={`min-w-0 flex-1 truncate font-medium ${
                todo.completed ? "line-through" : ""
              }`}
            >
              {todo.title}
            </motion.p>
            <motion.p layout className={`text-sm ${todo.completed ? "" : ""}`}>
              {todo.description}
            </motion.p>
            <motion.div layout className="mt-1 flex items-center gap-1 text-sm">
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
