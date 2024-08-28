import { ColorPicker } from "@/components/custom/PickColor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PREDEFINED_COLORS, STATUS_COLORS } from "@/constants";
import { Project, ProjectStatus } from "@/interfaces/types";
import { addProject } from "@/stores/todox/actions";
import { useTodoxStore } from "@/stores/todox/todoxStore";
import { faker } from "@faker-js/faker";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { TbSquareRounded } from "react-icons/tb";
import { NavLink } from "react-router-dom";

interface MenuItem {
  name: string;
  link: string;
  color: string;
}

const defaultMenus: MenuItem[] = [
  { name: "All", link: "/todos", color: "text-blue-500" },
] as const;

export default function LayoutMenu() {
  const projects = useTodoxStore((state) => state.projects);

  return (
    <Card className="h-full rounded-md bg-white shadow-lg">
      <CardHeader className="py-3 pb-2">
        <h3 className="scroll-m-20 px-2 text-2xl font-semibold tracking-tight">
          Private
        </h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <nav className="flex h-80 flex-col space-y-1 overflow-y-auto">
          {defaultMenus.map((item) => (
            <MenuItem key={item.name} {...item} />
          ))}
          {}
          <Separator />
          <h3 className="px-1">Projects</h3>
          {Object.values(projects).map((project) => (
            <ProjectItem key={project.id} {...project} />
          ))}
        </nav>
        <CreateNewProjectButton />
      </CardContent>
      <Separator />
      <CardHeader className="pt-2">
        <h3 className="scroll-m-20 px-2 text-2xl font-semibold tracking-tight">
          Team
        </h3>
      </CardHeader>
      <CardContent className="space-x-4 text-center text-neutral-600">
        Coming soon!
      </CardContent>
    </Card>
  );
}

function ProjectItem({ id, title, status, iconColor }: Project) {
  console.log(iconColor);
  return (
    <NavLink
      data-testid={`project-item-${id}`}
      to={`/project/${id}`}
      className={({ isActive }) =>
        `flex items-center rounded-md px-4 py-2 text-sm transition-colors duration-150 ease-in-out ${
          isActive
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:bg-neutral-100"
        }`
      }
    >
      <TbSquareRounded
        className={`mr-3 size-7`}
        style={{ color: iconColor || "#000000" }}
      />
      <div className="flex w-full justify-between">
        <span>{title}</span>
        {status && (
          <Badge variant={"outline"}>
            <span className={`${STATUS_COLORS[status]}`}>{status}</span>
          </Badge>
        )}
      </div>
    </NavLink>
  );
}

export function MenuItem({ link, name, color }: MenuItem) {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `flex items-center rounded-md px-4 py-2 text-sm transition-colors duration-150 ease-in-out ${
          isActive
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:bg-gray-300"
        }`
      }
    >
      <TbSquareRounded className={`mr-3 size-6 ${color}`} />
      {name}
    </NavLink>
  );
}

function CreateNewProjectButton() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [iconColor, setIconColor] = useState("#000000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addProject({
      title,
      description,
      status,
      id: faker.string.uuid(),
      todoListIds: [],
      iconColor,
    });

    setIsOpen(false);
    setTitle("");
    setDescription("");
    setStatus(null);
    setIconColor(PREDEFINED_COLORS[0].value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          data-testid="create-new-project-open-button"
          className="w-full justify-start rounded-xl py-5 text-green-500 hover:bg-neutral-50"
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
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
