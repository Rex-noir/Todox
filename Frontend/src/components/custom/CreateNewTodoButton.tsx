import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";
import { CalendarIcon, PlusIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  addTodo,
  getAllProjects,
  getListFromProject,
} from "@/stores/todox/actions";
import { faker } from "@faker-js/faker";
import { useParams } from "react-router-dom";
import { Project, TodoList } from "@/interfaces/types";

export default function CreateNewTodo({
  listIdParam,
}: {
  listIdParam?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dueDate, setDueDate] = useState<Date>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [completed, setCompleted] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<string>("");
  const [listId, setListId] = useState(listIdParam || "");

  const { projectId: routeProjectId } = useParams();

  const [projects, setProjects] = useState<Project[]>([]);
  const [availableTodoLists, setAvailableTodoLists] = useState<TodoList[]>([]);

  useEffect(() => {
    const fetchedProjects = getAllProjects();
    setProjects(Array.isArray(fetchedProjects) ? fetchedProjects : []);

    if (routeProjectId) {
      setProjectId(routeProjectId);
    }
  }, [routeProjectId]);

  useEffect(() => {
    if (projectId) {
      const todoLists = getListFromProject(projectId);
      setAvailableTodoLists(Array.isArray(todoLists) ? todoLists : []);
    } else {
      setAvailableTodoLists([]);
    }
  }, [projectId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!projectId || !listId) {
      alert("Please select both a project and a parent list.");
      return;
    }

    addTodo({
      title,
      description,
      due_date: dueDate,
      priority,
      completed,
      project_id: projectId,
      todoList_id: listId,
      id: faker.string.uuid(),
    });

    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setPriority("");
    setCompleted(false);
    setProjectId("");
    setListId("");
  };

  const handleCancel = () => {
    resetForm();
    setIsOpen(false);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex items-center space-x-4">
        <CollapsibleTrigger asChild>
          <Button
            className="w-fit items-center gap-3 text-gray-500"
            variant={"link"}
            size={"sm"}
          >
            <PlusIcon />
            <span>Add Task</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-2 rounded-md border-2 p-2"
        >
          <div className="flex border-collapse flex-col">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="title"
              required
              placeholder="Title"
              className="border-none text-xl font-semibold shadow-none focus-visible:ring-0"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              placeholder="Description"
              rows={2}
              className="resize-none border-none shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="flex flex-wrap gap-2 border-b pb-2">
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-fit justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate
                      ? format(dueDate, "PPP")
                      : format(new Date(), "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    required
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Select onValueChange={(value) => setPriority(value)}>
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 4 }, (_, i) => (
                    <SelectItem key={i} value={`${i + 1}`}>
                      Priority {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={projectId}
                onValueChange={(value) => setProjectId(value)}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={listId}
                onValueChange={(value) => setListId(value)}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Select parent list" />
                </SelectTrigger>
                <SelectContent>
                  {projectId ? (
                    availableTodoLists.map((list) => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.title}
                      </SelectItem>
                    ))
                  ) : (
                    <div>Select a project to see the list</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 self-end">
            <Button onClick={handleCancel} type="button" variant={"outline"}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </CollapsibleContent>
    </Collapsible>
  );
}
