import { PREDEFINED_COLORS } from "@/constants";
import { ProjectStatus } from "@/interfaces/types";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ColorPicker } from "./PickColor";
import { useCreateProject } from "@/services/projectService";
import { TbLoader2 } from "react-icons/tb";

export default function CreateNewProjectButton() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [iconColor, setIconColor] = useState("#000000");

  const createProjectMutation = useCreateProject({
    title,
    description,
    status,
    iconColor,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createProjectMutation.mutate();
  };

  useEffect(() => {
    if (createProjectMutation.isSuccess) {
      setTitle("");
      setDescription("");
      setStatus(null);
      setIconColor(PREDEFINED_COLORS[0].value);
      setIsOpen(false);
    }
  }, [createProjectMutation.isSuccess]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          data-testid="create-new-project-open-button"
          className="w-full justify-start rounded-xl py-5 text-green-500 hover:bg-neutral-50 dark:hover:bg-slate-700"
          variant="secondary"
        >
          <PlusCircledIcon className="mr-3 size-5 font-bold" />
          <span>Create new project</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle data-testid="create-new-project-dialog-title">
          Create new project
        </DialogTitle>
        <DialogDescription />
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="title" className="">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="Enter project title"
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="description" className="">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={4}
                placeholder="Enter project description"
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status || undefined}
                onValueChange={(value) => setStatus(value as ProjectStatus)}
              >
                <SelectTrigger
                  aria-label="status"
                  id="status"
                  className="col-span-3"
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
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="iconColor">
                Icon Color -{" "}
                <span style={{ color: iconColor }}>{iconColor}</span>
              </Label>
              <div className="flex flex-wrap items-center gap-2">
                {PREDEFINED_COLORS.map((color) => (
                  <Button
                    key={color.value}
                    type="button"
                    variant={"outline"}
                    className={`h-8 w-8 p-0 border-[${color.value}]`}
                    style={{ borderColor: color.value }}
                    onClick={() => setIconColor(color.value)}
                    aria-label={color.name}
                    title={color.name}
                  >
                    {iconColor === color.value && <span>✓</span>}
                  </Button>
                ))}
                <ColorPicker onChange={setIconColor} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button data-testid="create-project-action" type="submit">
              {createProjectMutation.isPending ? (
                <TbLoader2 className="animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
