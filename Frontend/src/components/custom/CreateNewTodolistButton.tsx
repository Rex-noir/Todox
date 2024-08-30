import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { addTodoList, getCurrentViewProject } from "@/stores/todox/actions";
import { faker } from "@faker-js/faker";

export function CreateNewTodoList() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodoList({
      id: faker.string.uuid(),
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedTodosCount: 0,
      incompleteTodosCount: 0,
      todoIds: [],
      project_id: getCurrentViewProject()?.id || "",
    });

    setTitle("");
    setDescription("");
  };
  return (
    <Dialog defaultOpen={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <span className="ml-1 flex px-1 cursor-pointer items-center justify-center gap-1 text-green-500 hover:underline">
          Add todo list
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new todo list.</DialogTitle>
          <DialogDescription>Todo is a thing we need to do.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="title"
            />
          </div>
          <div>
            <Label htmlFor="description">Title</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              rows={5}
            />
          </div>
          <div className="flex justify-end">
            <Button size={"sm"}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
