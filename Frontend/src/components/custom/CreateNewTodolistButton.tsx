import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useParams } from "react-router-dom";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Badge } from "../ui/badge";
import { useCreateTodoList } from "@/services/todoListService";
import { TbLoaderQuarter } from "react-icons/tb";

export function CreateNewTodoList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const { projectId } = useParams();
  const useTodoListMutation = useCreateTodoList();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTodoList = {
      title,
      description,
      project_id: projectId ?? "",
      tags: JSON.stringify(tags),
    };

    useTodoListMutation.mutate(newTodoList);

    setTitle("");
    setTags([]);
    setDescription("");
  };

  useEffect(() => {
    if (useTodoListMutation.isSuccess) {
      setIsOpen(false);
    }
  }, [useTodoListMutation.isSuccess]);

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputValue = e.currentTarget.value.trim();
      if (inputValue) {
        setTags([...tags, inputValue]);
        e.currentTarget.value = "";
      }
    }
  };
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger asChild>
        <Button
          className="w-fit items-center gap-3 text-gray-500"
          variant={"link"}
          size={"sm"}
        >
          <PlusIcon />
          <span>Add List</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 rounded-md border-2 p-2"
        >
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="title"
              placeholder="Title"
              className="border-none text-xl font-semibold shadow-none focus-visible:ring-0"
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              rows={3}
              className="resize-none border-none shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div>
              Tags:{" "}
              <div className="mt-1 flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge variant={"outline"} key={tag}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Input onKeyDown={handleKeydown} placeholder="Enter tags" />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant={"outline"}
              onClick={() => setIsOpen(false)}
              size={"sm"}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" size={"sm"}>
              {!useTodoListMutation.isPending && "Create"}
              {useTodoListMutation.isPending && (
                <TbLoaderQuarter className="animate-spin" />
              )}
            </Button>
          </div>
        </form>
      </CollapsibleContent>
    </Collapsible>
  );
}
