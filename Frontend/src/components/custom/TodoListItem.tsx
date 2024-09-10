import { TodoList } from "@/interfaces/types";
import { Badge } from "../ui/badge";
import TodoListOptions from "./TodoListOptions";
import { useEffect, useState } from "react";
import { AutosizeTextarea } from "../ui/auto-text-area";
import { getProject } from "@/stores/todox/actions";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUpdateTodoList } from "@/services/todoListService";
import { LuLoader } from "react-icons/lu";

export function TodoListItem({ list }: { list: TodoList }) {
  const [editingMode, setEditingMode] = useState(false);
  const [parentProject] = useState(getProject(list?.project_id));
  const [title, setTitle] = useState(list?.title);
  const [description, setDescription] = useState(list?.description);
  const [tags, setTags] = useState<string[]>((list?.tags as string[]) || []); // Assume tags are strings
  const [newTag, setNewTag] = useState("");

  const removeTag = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prevTags) => [...prevTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission or other default actions
      handleAddTag();
    }
  };

  const updateMutation = useUpdateTodoList(list.id, {
    description,
    tags: JSON.stringify(tags),
    title,
    project_id: parentProject?.id,
  });

  const handleSave = () => {
    updateMutation.mutate();
  };

  const handleCancel = () => {
    setTitle(list?.title);
    setDescription(list?.description);
    setTags(list?.tags as []);
    setNewTag("");
    setEditingMode(false);
  };

  useEffect(() => {
    if (updateMutation.isSuccess) {
      setEditingMode(false);
    }
  }, [updateMutation.isSuccess]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="m-3 flex w-full cursor-pointer gap-3 break-all rounded-md text-left transition-colors duration-200"
    >
      {editingMode ? (
        <>
          <div className="flex w-full flex-col gap-3">
            <div>
              <AutosizeTextarea
                autoFocus
                className="!min-h-0 resize-none border-0 p-0 text-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <AutosizeTextarea
                className="minh resize-none border-0 p-0 text-sm text-muted-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                maxHeight={400}
              />
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <div className="flex flex-wrap gap-1">
                {Array.isArray(tags) &&
                  tags.map((tag) => (
                    <Badge onClick={() => removeTag(tag)} key={tag}>
                      {tag}
                    </Badge>
                  ))}
              </div>
              <Input
                placeholder="Enter to add, click the tag to remove"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleInputKeyDown}
              />
            </div>
            <div className="flex justify-end gap-2 self-end">
              <Button variant={"outline"} size={"sm"} onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} variant={"destructive"} size={"sm"}>
                {updateMutation.isPending ? (
                  <LuLoader className="animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="cursor-text w-full" onClick={() => setEditingMode(true)}>
          <div className="flex justify-between gap-2 text-justify">
            <p className="text-xl leading-tight">{title}</p>
            <TodoListOptions listId={list.id} />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex gap-1 flex-wrap mt-3">
            {Array.isArray(tags)&&tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
