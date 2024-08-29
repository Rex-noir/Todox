import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project, TodoList } from "@/interfaces/types";
import { useState } from "react";
import { LuListTodo } from "react-icons/lu";

export default function ViewProject() {
  const [project, setProject] = useState<Project | null>(null);
  return (
    <Card className="h-full rounded-md">
      <CardHeader>
        <CardTitle>{project?.title ?? "username"}</CardTitle>
        <CardDescription>hi</CardDescription>
      </CardHeader>
      <CardContent>{/* Project list view */}</CardContent>
    </Card>
  );
}

export function TodoListItem({ list }: { list: TodoList }) {
  return (
    <div className="flex cursor-pointer gap-3 overflow-hidden rounded-md bg-white p-3 hover:bg-neutral-100">
      <div className="flex items-start gap-4">
        <LuListTodo className="mt-1 size-5 text-blue-500" />
      </div>
      <div className="grid w-full items-center gap-1 sm:gap-3 md:grid-cols-3">
        <div className="w-fit max-w-full overflow-hidden">
          <p className="min-w-0 flex-1 truncate">{list.title}</p>
          <p className="truncate text-sm font-thin">{list.description}</p>
        </div>
      </div>
    </div>
  );
}
