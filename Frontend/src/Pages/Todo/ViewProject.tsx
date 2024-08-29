import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project, TodoList } from "@/interfaces/types";
import { useState } from "react";

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

export function TodoListItem({list}:{list:TodoList}){
  return (
    <div>
      Todoslist 
    </div>
  )
}