import { selectListFromStore, useTodoxStore } from "@/stores/todox/todoxStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { getProject } from "@/stores/todox/actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { AutosizeTextarea } from "../ui/auto-text-area";
import { Badge } from "../ui/badge";
import { useUpdateTodoList } from "@/services/todoListService";
import { LuLoader } from "react-icons/lu";
import TodoListOptions from "./TodoListOptions";

interface TodoListDialogProps {
  id: string;
  open: boolean;
  onOpenChange: () => void;
}

export default function TodoListDialog({
  open,
  id,
  onOpenChange,
}: TodoListDialogProps) {
  const list = useTodoxStore(selectListFromStore)(id);
  const [parentProject] = useState(getProject(list?.project_id));
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(list?.title);
  const [description, setDescription] = useState(list?.description);
  const [tags, setTags] = useState<string[]>((list?.tags as string[]) || []); // Assume tags are strings
  const [newTag, setNewTag] = useState("");

  const updateMutation = useUpdateTodoList(id, {
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
    onOpenChange();
    setEdit(false);
  };

  useEffect(() => {
    if (updateMutation.isSuccess) {
      setEdit(false);
    }
  }, [updateMutation.isSuccess]);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-1 p-1 sm:h-fit">
        <div className="flex flex-row items-center justify-between gap-2 border-b p-2">
          <div className="flex max-w-[70%] overflow-hidden">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="max-w-14 md:max-w-52">
                  <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {parentProject?.title}
                  </span>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem className="max-w-16 md:max-w-52">
                  <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {list?.title}
                  </span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex gap-2">
            <TodoListOptions listId={id} />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onOpenChange();
              }}
              size={"sm"}
              variant={"ghost"}
            >
              <IoIosCloseCircleOutline className="size-5 cursor-pointer" />
            </Button>
          </div>
        </div>
        <VisuallyHidden.Root>
          <DialogTitle className="!size-0" />
          <DialogDescription className="!size-0" />
        </VisuallyHidden.Root>
        <div className="break-all">
          {edit ? (
            <div className="flex flex-col gap-4 rounded-md border p-2">
              <div>
                <AutosizeTextarea
                  className="!min-h-0 resize-none border-0 p-0 text-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Title"
                  rows={1}
                  maxHeight={400}
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
                <AutosizeTextarea
                  className="border-0 p-0 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  maxHeight={400}
                />
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
              </div>
              <div className="flex gap-2 self-end">
                <Button variant={"outline"} size={"sm"} onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant={"destructive"}
                  size={"sm"}
                >
                  {updateMutation.isPending ? (
                    <LuLoader className="animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div onClick={() => setEdit(!edit)} className="p-2">
                <h2 className="text-lg font-semibold">{list?.title}</h2>
                <p className="text-sm">{list?.description}</p>
                <div className="mt-2 flex gap-1">
                  {Array.isArray(tags) &&
                    tags.map((tag) => (
                      <Badge key={tag} className="">
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
